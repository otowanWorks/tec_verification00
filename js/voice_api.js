// TODO: VOICEVOXのURL (デフォルトの設定の場合は変える必要なし)
const VOICE_VOX_API_URL = "http://localhost:50021";

// VOICEVOXのSpeakerID
const VOICEVOX_SPEAKER_ID = '10';

// 音声再生用のAudioオブジェクト
var audio = new Audio();

/**
 * VOICEVOXを使用してテキストを音声で再生する
 * @param {string} inputText - 読み上げるテキスト
 * @returns {Promise<void>}
 */
const playVoice = async (inputText) => {
    try {
        // 既存の音声を停止
        audio.pause();
        audio.currentTime = 0;

        // 音声クエリの生成
        const ttsQuery = await fetch(VOICE_VOX_API_URL + '/audio_query?speaker=' + VOICEVOX_SPEAKER_ID + '&text=' + encodeURI(inputText), {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!ttsQuery.ok) {
            console.error('VOICEVOX音声クエリ生成に失敗:', ttsQuery.status);
            return;
        }

        const queryJson = await ttsQuery.json();

        // 音声合成
        const response = await fetch(VOICE_VOX_API_URL + '/synthesis?speaker=' + VOICEVOX_SPEAKER_ID + '&speedScale=1.2', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryJson)
        });

        if (!response.ok) {
            console.error('VOICEVOX音声合成に失敗:', response.status);
            return;
        }

        const blob = await response.blob();
        const audioSourceURL = window.URL || window.webkitURL;
        audio = new Audio(audioSourceURL.createObjectURL(blob));

        // 音声再生
        await audio.play();

        console.log('VOICEVOX音声再生開始');
    } catch (error) {
        console.error('VOICEVOX API エラー:', error);
        console.log('VOICEVOXが起動しているか確認してください。');
    }
};

/**
 * 音声再生を停止する
 */
const stopVoice = () => {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
};

/**
 * 音声が再生中かどうかを確認する
 * @returns {boolean}
 */
const isVoicePlaying = () => {
    return audio && !audio.paused && !audio.ended;
};

// キーワードに基づく画像選択機能
function getImageForComment(comment) {
    // その1: 感謝系キーワード
    const gratitudeKeywords = ["ありがとう", "感謝", "助か", "お礼", "恐縮", "すみません", "申し訳", "おかげで", "感謝します", "ありがたい", "お疲れ様", "恐れ入ります"];
    if (gratitudeKeywords.some(keyword => comment.includes(keyword))) {
        return "image/character002.png";
    }

    // その2: 理解系キーワード
    const understandingKeywords = ["なるほど", "わかりました", "理解", "そうですね", "そうか", "納得", "了解", "把握", "クリア", "明確", "はっきり", "腑に落ちた", "スッキリ"];
    if (understandingKeywords.some(keyword => comment.includes(keyword))) {
        return "image/character003.png";
    }

    // その3: 挨拶系キーワード
    const greetingKeywords = ["こんにちは", "はじめまして", "おはよう", "お疲れ", "こんばんは", "よろしく", "初回", "今日は", "お世話になります", "参加", "来ました", "伺い"];
    if (greetingKeywords.some(keyword => comment.includes(keyword))) {
        return "image/character004.png";
    }

    // その4: 褒め言葉系キーワード
    const praiseKeywords = ["上手", "良い", "素晴らしい", "正解", "完璧", "最高", "優秀", "見事", "さすが", "流石", "よくできた", "グッド", "ナイス", "いいね", "いいですね"];
    if (praiseKeywords.some(keyword => comment.includes(keyword))) {
        return "image/character005.png";
    }

    // その5: 励まし系キーワード
    const encouragementKeywords = ["大丈夫", "頑張", "できない", "無理", "不安", "心配", "困った", "つらい", "疲れた", "挫折", "諦め", "落ち込", "やる気", "元気"];
    if (encouragementKeywords.some(keyword => comment.includes(keyword))) {
        return "image/character006.png";
    }

    // その0: デフォルト（キーワードが見つからない場合）
    return "image/character001.png";
}

// キャラクター画像切り替え機能
var currentBaseImage = "image/character001.png";

function changeCharacterImage(newImagePath) {
    currentBaseImage = newImagePath;
    const charaImg = document.getElementById("charaImg");
    if (charaImg) {
        charaImg.src = newImagePath;
        // 画像変更時のアニメーション効果（オプション）
        charaImg.style.opacity = '0.8';
        setTimeout(() => {
            charaImg.style.opacity = '1';
        }, 200);
    }
}

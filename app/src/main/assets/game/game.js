/**
	GRADLE - KNOWLEDGE IS POWER

    @author : gradle (gradlecode@outlook.com)
	@date: 03/11/2019 13:10:00
	@version_name: gradle-logic
	@version_code: v1.0.79
	copyright @2019
*/

function resetDeck() {
    aDeck = new Array;
    for (var a = 0; 52 > a; a++) aDeck.push({
        id: a,
        value: a % 13 + 1
    })
}

function initStartScreen() {
    gameState = "start";
    bet = 0, bank = 1e3;
	
	userInput.addHitArea("mute", butEventHandler, null, {
        type: "rect",
        aRect: [455, 0, canvas.width, 75]
    }, !0);
		
	userInput.addHitArea("help", butEventHandler, null, {
        type: "rect",
        aRect: [0, 0, 80, 75]
    }, !0);
	
    var b = new Array(canvas.width / 2, 520);
    screens = new Elements.Screens({
        startImageData: assetLib.getData("titleScreen"),
		sound0: assetLib.getData("sound0"),
		sound1: assetLib.getData("sound1"),
    }, {
        play: {
            imageData: assetLib.getData("playBut"),
            pos: b
        }
    }, canvas.width, canvas.height);
	
	screens.setRenderFunc("start");
	
	userInput.addHitArea("startGame", butEventHandler, b, {
        type: "image",
        oImageData: assetLib.getData("playBut"),
        aCentrePos: b
    });
	
	userInput.addHitArea("moreGames", butEventHandler, null, {
        type: "rect",
        aRect: [120, 625, 410, 680]
    });
	
	previousTime = (new Date).getTime(), updateStartScreenEvent()
}

function initBetting() {
    gameState = "betting", insuranceTaken = !1, playSound("chipIntro"), userInput.addHitArea("quitGameBetting", butEventHandler, null, {
        type: "rect",
        aRect: [0, 0, 80, 75]
    }, !0), userInput.addHitArea("addChip", butEventHandler, {
        id: 0
    }, {
        type: "rect",
        aRect: [0, 630, 133, 758]
    }), userInput.addHitArea("addChip", butEventHandler, {
        id: 1
    }, {
        type: "rect",
        aRect: [133, 630, 266, 758]
    }), userInput.addHitArea("addChip", butEventHandler, {
        id: 2
    }, {
        type: "rect",
        aRect: [266, 630, 399, 758]
    }), userInput.addHitArea("addChip", butEventHandler, {
        id: 3
    }, {
        type: "rect",
        aRect: [399, 630, 533, 758]
    }), userInput.addHitArea("removeChip", butEventHandler, null, {
        type: "rect",
        aRect: [170, 390, 360, 530]
    }), userInput.addHitArea("deal", butEventHandler, null, {
        type: "rect",
        aRect: [390, 390, canvas.width, 530]
    });
	background = new Elements.Background({
		bg : assetLib.getData("background"),
		sound0 : assetLib.getData("sound0"),
		sound1 : assetLib.getData("sound1")
		
		}, canvas.width, canvas.height);
	numbers = new Elements.Numbers(assetLib.getData("numbers"), canvas.width, canvas.height), numbers.setAmounts(bet, bank), panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("numbers"), canvas.width, canvas.height), panel.setUp("betting"), chips = new Elements.Chips(assetLib.getData("chips"), aChipAmounts, canvas.width, canvas.height), chips.setAmounts(bet, bank), chips.setUp("betting"), previousTime = (new Date).getTime(), updateBettingEvent()
}

function initHelp() {
    gameState = "help", userInput.addHitArea("quitHelp", butEventHandler, null, {
        type: "rect",
        aRect: [0, 0, 80, 75]
    }, !0), ctx.drawImage(assetLib.getData("helpScreen").img, 0, 0)
}

function initDeal() {
    gameState = "dealing", resetDeck(), playSound("cardHard"), userInput.addHitArea("quitGameDealing", butEventHandler, null, {
        type: "rect",
        aRect: [0, 0, 80, 75]
    }, !0), userInput.addHitArea("hit", butEventHandler, null, {
        type: "rect",
        aRect: [266, 630, 399, 758]
    }), userInput.addHitArea("stand", butEventHandler, null, {
        type: "rect",
        aRect: [399, 630, 533, 758]
    }), aPCards2 = new Array, aPCards1 = aCurPlayerCards = getCards(2), aCompCards = getCards(1), 11 != roundToTen(this.aCurPlayerCards[0].value) + roundToTen(this.aCurPlayerCards[1].value) || 1 != this.aCurPlayerCards[0].value && 1 != this.aCurPlayerCards[1].value ? roundToTen(this.aCurPlayerCards[0].value) == roundToTen(this.aCurPlayerCards[1].value) && bank >= bet ? (dealType = "split", userInput.addHitArea("split", butEventHandler, null, {
        type: "rect",
        aRect: [0, 630, 133, 758]
    })) : dealType = "normal" : dealType = "blackjack";
    var a = !1,
        b = !1;
    1 == aCompCards[0].value && bank >= bet && (userInput.addHitArea("insure", butEventHandler, null, {
        type: "rect",
        aRect: [0, 200, 150, 350]
    }), a = !0), bank >= bet && (userInput.addHitArea("double", butEventHandler, null, {
        type: "rect",
        aRect: [133, 630, 266, 758]
    }), b = !0), panel.setUp("firstDeal", {
        dealType: dealType,
        insuranceIsOn: a,
        value: getBestValue(this.aCurPlayerCards),
        callback: initBlackjackCompare
    }), cards = new Elements.Cards(assetLib.getData("cards"), canvas.width, canvas.height), cards.setUp("firstDeal", {
        aPlayerDealtCards: this.aCurPlayerCards,
        aCompDealtCards: this.aCompCards,
        dealType: dealType
    }), chips.setUp("firstDeal"), previousTime = (new Date).getTime(), buttons = new Elements.Buttons(assetLib.getData("buttons"), canvas.width, canvas.height), buttons.setUp("firstDeal", {
        dealType: dealType,
        doubleIsOn: b
    }), updateDealingEvent()
}

function initBlackjackCompare() {
    var a = getCards(1)[0];
    aCompCards.push(a), panel.setUp("compPlay", {
        value: getBestValue(aCompCards)
    }), cards.setUp("compPlay", {
        oHoleCard: a,
        callback: checkBlackjack
    })
}

function initCompPlay() {
    var a;
    a = insuranceTaken ? insuranceCard : getCards(1)[0], aCompCards.push(a), playSound("cardSoft"), panel.setUp("compPlay", {
        value: getBestValue(aCompCards)
    }), cards.setUp("compPlay", {
        oHoleCard: a,
        callback: checkHands
    })
}

function dealNewCompCard() {
    var a = getCards(1)[0];
    aCompCards.push(a), playSound("cardSoft"), panel.setUp("newCompCard", {
        value: getBestValue(aCompCards)
    }), cards.setUp("newCompCard", {
        oNewCard: a,
        callback: checkHands
    })
}

function initCompShow() {
    var a = getCards(1)[0];
    aCompCards.push(a), playSound("cardSoft"), cards.setUp("compShow", {
        oHoleCard: a
    })
}

function initCompInsuranceShow() {
    aCompCards.push(insuranceCard), playSound("cardSoft"), panel.setUp("compPlay", {
        value: getBestValue(aCompCards)
    }), cards.setUp("compInsuranceShow", {
        oHoleCard: insuranceCard,
        callback: checkInsuranceHand
    })
}

function checkInsuranceHand() {
    var a = getBestValue(aCompCards);
    21 == a ? (bank += Math.round(1.5 * bet), bet = 0, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), panel.setUp("insuranceWin"), buttons.setUp("insuranceWin"), userInput.addHitArea("replay", butEventHandler, null, {
        type: "rect",
        aRect: [390, 390, canvas.width, 530]
    })) : buttons.canHit = !0
}

function checkHands() {
    var a = getBestValue(aCompCards),
        b = getBestValue2(aPCards1, aPCards2);
    if (a > 21) panel.setUp("compBust"), playSound("win"), bank += 2 * bet, bet = 0, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), userInput.addHitArea("replay", butEventHandler, null, {
        type: "rect",
        aRect: [390, 390, canvas.width, 530]
    });
    else if (a > 16)
        if (a > b) {
            if (panel.setUp("compWin", {
                bank: bank
            }), playSound("bust"), 5 > bank) {
                bank = 1e3;
            }
            bet = 0, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), userInput.addHitArea("replay", butEventHandler, null, {
                type: "rect",
                aRect: [390, 390, canvas.width, 530]
            })
        } else b > a ? (panel.setUp("playerWin"), playSound("win"), bank += 2 * bet, bet = 0, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), userInput.addHitArea("replay", butEventHandler, null, {
            type: "rect",
            aRect: [390, 390, canvas.width, 530]
        })) : (panel.setUp("push"), playSound("push"), bank += bet, bet = 0, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), userInput.addHitArea("replay", butEventHandler, null, {
            type: "rect",
            aRect: [390, 390, canvas.width, 530]
        }));
    else dealNewCompCard()
}

function checkBlackjack() {
    var a = getBestValue(aCompCards);
    21 == a ? (console.log("push"), panel.setUp("push"), playSound("push"), bank += bet, bet = 0, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), userInput.addHitArea("replay", butEventHandler, null, {
        type: "rect",
        aRect: [390, 390, canvas.width, 530]
    })) : (panel.setUp("blackjack"), playSound("blackjack"), bank += bet + Math.round(bet *= 1.5), bet = 0, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), userInput.addHitArea("replay", butEventHandler, null, {
        type: "rect",
        aRect: [390, 390, canvas.width, 530]
    }))
}

function roundToTen(a) {
    return a > 10 && (a = 10), a
}

function getBestValue(a) {
    for (var b = 0, c = 0, d = 0; d < a.length; d++) 1 == a[d].value ? (c++, b += 11) : b += roundToTen(a[d].value);
    if (b > 21)
        for (var d = 0; c > d && (b -= 10, !(21 >= b)); d++);
    return b
}

function getBestValue2(a, b) {
    var c = getBestValue(a),
        d = getBestValue(b);
    return c > 22 ? d : d > 22 ? c : c > d ? c : d
}

function getCards(a) {
    for (var b = new Array, c = 0; a > c && aDeck.length > 0; c++) {
        var d = Math.floor(Math.random() * aDeck.length);
        b.push(aDeck[d]), aDeck.splice(d, 1)
    }
    return b
}

function dealNewPlayerCard(a) {
    "undefined" == typeof a && (a = !1);
    var b = getCards(1)[0];
    aCurPlayerCards.push(b), panel.setUp("newPlayerCard", {
        value: getBestValue(aCurPlayerCards)
    }), getBestValue(aCurPlayerCards) > 21 ? splitTaken ? (splitTaken = !1, cards.setUp("newPlayerCard", {
        newCard: b
    }), panel.setUp("switchHands", {
        callback: dealNewPlayerCard,
        event: "bust"
    }), bet /= 2, numbers.setAmounts(bet, bank), cards.setUp("switchHands"), aCurPlayerCards = aPCards2) : getBestValue(aPCards1) > 21 ? (panel.setUp("bust", {
        bank: bank
    }), 5 > bank && (bank = 1e3), buttons.setUp("bust"), chips.setUp("bust"), playSound("bust"), bet = 0, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), userInput.addHitArea("replay", butEventHandler, null, {
        type: "rect",
        aRect: [390, 390, canvas.width, 530]
    }), cards.setUp("newPlayerCard", {
        newCard: b,
        callback: initCompShow
    })) : (userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), buttons.setUp("stand"), panel.setUp("stand"), initCompPlay()) : a ? cards.setUp("newPlayerCard", {
        newCard: b,
        callback: initCompPlay
    }) : cards.setUp("newPlayerCard", {
        newCard: b
    })
}

function butEventHandler(a, b) {
    switch (a) {
    case "replay":
        playSound("click"), userInput.removeHitArea("replay"), userInput.removeHitArea("quitGameDealing"), bet = 0, numbers.setAmounts(bet, bank), initBetting();
        break;
    case "split":
        buttons.canHit && (playSound("click"), splitTaken = !0, aPCards2 = new Array, aPCards2.push(aCurPlayerCards.pop()), aPCards1 = aCurPlayerCards, bank -= bet, bet *= 2, numbers.setAmounts(bet, bank), userInput.removeHitArea("split"), userInput.removeHitArea("double"), buttons.setUp("split"), cards.setUp("split"), dealNewPlayerCard(), panel.setUp("split", {
            playerHandTotal1: getBestValue(aPCards1),
            playerHandTotal2: getBestValue(aPCards2)
        }), insuranceTaken && panel.setUp("hidePlayOn"));
        break;
    case "double":
        buttons.canHit && (playSound("cardSoft"), bank -= bet, bet *= 2, userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), numbers.setAmounts(bet, bank), buttons.setUp("double"), chips.setUp("double"), dealNewPlayerCard(!0), insuranceTaken && panel.setUp("hidePlayOn"));
        break;
    case "hit":
        buttons.canHit && (playSound("cardSoft"), userInput.removeHitArea("split"), userInput.removeHitArea("double"), buttons.setUp("hit"), dealNewPlayerCard(), insuranceTaken && panel.setUp("hidePlayOn"));
        break;
    case "stand":
        buttons.canHit && (playSound("click"), splitTaken ? (splitTaken = !1, panel.setUp("switchHands", {
            callback: dealNewPlayerCard
        }), cards.setUp("switchHands"), aCurPlayerCards = aPCards2) : (userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), buttons.setUp("stand"), panel.setUp("stand"), initCompPlay()), insuranceTaken && panel.setUp("hidePlayOn"));
        break;
    case "startGame":
		document.body.style.backgroundImage="url('./images/back_game.png')";
        playSound("click"), userInput.removeHitArea("startGame"), userInput.removeHitArea("help"), userInput.removeHitArea("moreGames"), initBetting();
        break;
    case "moreGames":
        playSound("click");
        break;
    case "help":
        playSound("click"), userInput.removeHitArea("startGame"), userInput.removeHitArea("help"), userInput.removeHitArea("moreGames"), initHelp();
        break;
    case "quitHelp":
        playSound("click"), userInput.removeHitArea("quitHelp"), initStartScreen();
        break;
    case "mute":
        playSound("click"), toggleMute();
        break;
    case "quitGameBetting":
		document.body.style.backgroundImage="url('./images/back_menu.png')";
        playSound("click"), userInput.removeHitArea("quitGameBetting"), userInput.removeHitArea("addChip"), userInput.removeHitArea("removeChip"), userInput.removeHitArea("deal"), initStartScreen();
        break;
    case "quitGameDealing":
		document.body.style.backgroundImage="url('./images/back_menu.png')";
        playSound("click"), userInput.removeHitArea("quitGameDealing"), userInput.removeHitArea("split"), userInput.removeHitArea("double"), userInput.removeHitArea("hit"), userInput.removeHitArea("stand"), userInput.removeHitArea("insure"), userInput.removeHitArea("replay"), initStartScreen();
        break;
    case "addChip":
        aChipAmounts[b.id] <= bank && (playSound("chip"), panel.showDealBut(), bet += aChipAmounts[b.id], bank -= aChipAmounts[b.id], numbers.setAmounts(bet, bank), chips.addChip(b.id, bet, bank));
        break;
    case "removeChip":
        bet >= 5 && (playSound("click"), bet -= aChipAmounts[chips.aBetChips[chips.aBetChips.length - 1]], bank += aChipAmounts[chips.aBetChips[chips.aBetChips.length - 1]], numbers.setAmounts(bet, bank), chips.removeChip(bet, bank), 0 >= bet && panel.hideDealBut());
        break;
    case "deal":
        bet > 0 && (playSound("click"), userInput.removeHitArea("quitGameBetting"), userInput.removeHitArea("addChip"), userInput.removeHitArea("removeChip"), userInput.removeHitArea("deal"), initDeal());
        break;
    case "insure":
        playSound("click"), insuranceCard = getCards(1)[0], bank -= Math.round(bet / 2), numbers.setAmounts(bet, bank), insuranceTaken = !0, 10 == roundToTen(insuranceCard.value) ? (panel.setUp("insuranceTaken"), initCompInsuranceShow(), buttons.canHit = !1) : panel.setUp("insuranceLose")
    }
	gradle.event(a);
}

function updateDealingEvent() {
    rotatePause || "dealing" != gameState || (getDelta(), background.render(ctx), numbers.render(ctx), chips.render(ctx), cards.render(ctx), buttons.render(ctx), panel.render(ctx), requestAnimFrame(updateDealingEvent))
}

function updateBettingEvent() {
    rotatePause || "betting" != gameState || (getDelta(), background.render(ctx), numbers.render(ctx), chips.render(ctx), panel.render(ctx), requestAnimFrame(updateBettingEvent))
}

function updateSplashScreenEvent() {
    if (!rotatePause && "splash" == gameState) {
        var a = getDelta();
        if (splashTimer += a, splashTimer > 2.5) return initStartScreen(), void 0;
        splash.render(ctx, a), requestAnimFrame(updateSplashScreenEvent)
    }
}

function updateStartScreenEvent() {
    if (!rotatePause && "start" == gameState) {
        var a = getDelta();
        screens.render(ctx, a), requestAnimFrame(updateStartScreenEvent)
    }
}

function getDelta() {
    var a = (new Date).getTime(),
        b = (a - previousTime) / 1e3;
    return previousTime = a, b > .5 && (b = 0), b
}

function renderSprite(a) {
    ctx.save(), ctx.translate(a.x, a.y), ctx.rotate(a.rotation), a.render(ctx), ctx.restore()
}

function loadPreloader() {
	loadAssets()
}


function loadAssets() {
    assetLib = new Utils.AssetLoader([{
        id: "background",
        file: "images/background.png"
    }, {
        id: "helpScreen",
        file: "images/helpScreen.jpg"
    }, {
        id: "sound0",
        file: "images/sound0.png"
    }, {
        id: "sound1",
        file: "images/sound1.png"
    }, {
        id: "titleScreen",
        file: "images/titleScreen.jpg"
    }, {
        id: "rotateDeviceMessage",
        file: "images/rotateDeviceMessage.jpg"
    }, {
        id: "playBut",
        file: "images/playBut.png"
    }, {
        id: "panels",
        file: "images/panels_379x159.png",
        oData: {
            columns: 4,
            spriteWidth: 379,
            spriteHeight: 159
        }
    }, {
        id: "numbers",
        file: "images/numbers_17x36.png",
        oData: {
            columns: 3,
            spriteWidth: 17,
            spriteHeight: 36
        }
    }, {
        id: "cards",
        file: "images/cards_128x173.png",
        oData: {
            columns: 9,
            spriteWidth: 128,
            spriteHeight: 173
        }
    }, {
        id: "buttons",
        file: "images/buttons_131x133.png",
        oData: {
            columns: 4,
            spriteWidth: 131,
            spriteHeight: 133
        }
    }, {
        id: "chips",
        file: "images/chips_133x133.png",
        oData: {
            columns: 2,
            spriteWidth: 133,
            spriteHeight: 133
        }
    }], ctx, canvas.width, canvas.height), assetLib.onReady(initStartScreen)
}

function resizeCanvas() {
    var a = window.innerWidth,
        b = window.innerHeight;
    a > 480 && (a -= 1, b -= 1), window.innerWidth > window.innerHeight && isMobile ? ("loading" != gameState && rotatePauseOn(), a / canvas.width < b / canvas.height ? (canvas.style.width = a + "px", canvas.style.height = a / canvas.width * canvas.height + "px", canvasX = 0, canvasY = (b - a / canvas.width * canvas.height) / 2, canvasScaleX = canvasScaleY = canvas.width / a, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px") : (canvas.style.width = b / canvas.height * canvas.width + "px", canvas.style.height = b + "px", canvasX = (a - b / canvas.height * canvas.width) / 2, canvasY = 0, canvasScaleX = canvasScaleY = canvas.height / b, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px")) : isMobile ? (rotatePause && rotatePauseOff(), canvasX = canvasY = 0, canvasScaleX = canvas.width / a, canvasScaleY = canvas.height / b, canvas.style.width = a + "px", canvas.style.height = b + "px", div.style.marginTop = "0px", div.style.marginLeft = "0px") : (rotatePause && rotatePauseOff(), a / canvas.width < b / canvas.height ? (canvas.style.width = a + "px", canvas.style.height = a / canvas.width * canvas.height + "px", canvasX = 0, canvasY = (b - a / canvas.width * canvas.height) / 2, canvasScaleX = canvasScaleY = canvas.width / a, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px") : (canvas.style.width = b / canvas.height * canvas.width + "px", canvas.style.height = b + "px", canvasX = (a - b / canvas.height * canvas.width) / 2, canvasY = 0, canvasScaleX = canvasScaleY = canvas.height / b, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px")), userInput.setCanvas(canvasX, canvasY, canvasScaleX, canvasScaleY)
}

function playSound(a) {
    allowSound && sound.play(a)
}

function toggleMute() {
    muted = !muted, allowSound && (muted ? Howler.mute() : Howler.unmute())
}

function toggleManualPause() {
    manualPause ? (manualPause = !1, allowSound && (muted || Howler.unmute()), pauseCoreOff()) : (manualPause = !0, allowSound && Howler.mute(), pauseCoreOn())
}

function rotatePauseOn() {
    rotatePause = !0, ctx.drawImage(assetLib.getImg("rotateDeviceMessage"), 0, 0), pauseCoreOn()
}

function rotatePauseOff() {
    rotatePause = !1, pauseCoreOff()
}

function pauseCoreOn() {
    switch (userInput.pauseIsOn = !0, gameState) {
    case "start":
        break;
    case "betting":
        break;
    case "dealing":
    }
}

function pauseCoreOff() {
    switch (previousTime = (new Date).getTime(), userInput.pauseIsOn = !1, gameState) {
    case "splash":
        updateSplashScreenEvent();
        break;
    case "start":
        initStartScreen();
        break;
    case "help":
        initHelp();
        break;
    case "betting":
        updateBettingEvent();
        break;
    case "dealing":
        updateDealingEvent()
    }
}
var Utils;
! function (a) {
    var b = function () {
        function a(a, b, c, d, e) {
            "undefined" == typeof e && (e = !0), this.oAssetData = {}, this.assetsLoaded = 0, this.totalAssets = a.length, this.ctx = b, this.canvasWidth = c, this.canvasHeight = d, this.showBar = e, this.topLeftX = this.canvasWidth / 2 - c / 4, this.topLeftY = this.canvasHeight / 2 + 100, this.showBar && (ctx.fillStyle = "#aaaaaa", ctx.textAlign = "center", ctx.font = "16px Helvetica", ctx.fillText("Loading...", this.canvasWidth / 2, this.topLeftY - 10), ctx.strokeStyle = "#aaaaaa", ctx.lineWidth = 2, ctx.fillStyle = "#ffffff", ctx.moveTo(this.topLeftX, this.topLeftY), ctx.lineTo(this.topLeftX + c / 2, this.topLeftY + 0), ctx.lineTo(this.topLeftX + c / 2, this.topLeftY + 20), ctx.lineTo(this.topLeftX + 0, this.topLeftY + 20), ctx.lineTo(this.topLeftX + 0, this.topLeftY + 0), ctx.stroke());
            for (var f = 0; f < a.length; f++) this.loadImage(a[f])
        }
        return a.prototype.loadImage = function (a) {
            var b = this,
                c = new Image;
            c.onload = function () {
                b.oAssetData[a.id] = {}, b.oAssetData[a.id].img = c, void 0 != a.oData && (b.oAssetData[a.id].oData = a.oData), ++b.assetsLoaded, b.showBar && ctx.fillRect(b.topLeftX + 2, b.topLeftY + 2, (b.canvasWidth / 2 - 4) / b.totalAssets * b.assetsLoaded, 16), b.checkLoadComplete()
            }, c.src = a.file
        }, a.prototype.checkLoadComplete = function () {
            this.assetsLoaded == this.totalAssets && this.loadedCallback()
        }, a.prototype.onReady = function (a) {
            this.loadedCallback = a
        }, a.prototype.getImg = function (a) {
            return this.oAssetData[a].img
        }, a.prototype.getData = function (a) {
            return this.oAssetData[a]
        }, a
    }();
    a.AssetLoader = b
}(Utils || (Utils = {}));
var Utils;
! function (a) {
    var b = function () {
        function a(a, b, c, d) {
            this.x = 0, this.y = 0, this.rotation = 0, this.radius = 10, this.removeMe = !1, this.frameInc = 0, this.animType = "loop", this.oImgData = a, this.oAnims = this.oImgData.oData.oAnims, this.fps = b, this.radius = c, this.animId = d
        }
        return a.prototype.updateAnimation = function (a) {
            this.frameInc += this.fps * a
        }, a.prototype.resetAnim = function () {
            this.frameInc = 0
        }, a.prototype.setFrame = function (a) {
            this.fixedFrame = a
        }, a.prototype.setAnimType = function (a, b) {
            switch (this.animId = b, this.animType = a, a) {
            case "loop":
                break;
            case "once":
                this.resetAnim(), this.maxIdx = this.oAnims[this.animId].length - 1
            }
        }, a.prototype.render = function (a) {
            if (null != this.animId) {
                var b = this.oAnims[this.animId].length,
                    c = Math.floor(this.frameInc),
                    d = this.oAnims[this.animId][c % b],
                    e = d * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                    f = Math.floor(d / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if ("once" == this.animType && c > this.maxIdx) {
                    this.fixedFrame = this.oAnims[this.animId][b - 1], this.animId = null, this.animEndedFunc();
                    var e = this.fixedFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                        f = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight
                }
            } else var e = this.fixedFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                f = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            a.drawImage(this.oImgData.img, e, f, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2, -this.oImgData.oData.spriteHeight / 2, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight)
        }, a
    }();
    a.AnimSprite = b
}(Utils || (Utils = {}));
var Utils;
! function (a) {
    var b = function () {
        function a(a, b) {
            this.x = 0, this.y = 0, this.rotation = 0, this.radius = 10, this.removeMe = !1, this.oImgData = a, this.radius = b
        }
        return a.prototype.setFrame = function (a) {
            this.frameNum = a
        }, a.prototype.render = function (a) {
            var b = this.frameNum * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                c = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            a.drawImage(this.oImgData.img, b, c, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2, -this.oImgData.oData.spriteHeight / 2, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight)
        }, a
    }();
    a.BasicSprite = b
}(Utils || (Utils = {}));
var Utils;
! function (a) {
    var b = function () {
        function a(a, b) {
            var c = this;
            this.isDown = !1, this.canvasX = 0, this.canvasY = 0, this.canvasScaleX = 1, this.canvasScaleY = 1, this.prevHitTime = 0, this.pauseIsOn = !1, this.isBugBrowser = b, a.addEventListener("touchstart", function (a) {
                c.hitDown(a, a.touches[0].pageX, a.touches[0].pageY)
            }, !1), a.addEventListener("touchend", function (a) {
                c.hitUp(a, a.changedTouches[0].pageX, a.changedTouches[0].pageY)
            }, !1), a.addEventListener("mousedown", function (a) {
                c.hitDown(a, a.pageX, a.pageY)
            }, !1), a.addEventListener("mouseup", function (a) {
                c.hitUp(a, a.pageX, a.pageY)
            }, !1), this.aHitAreas = new Array
        }
        return a.prototype.setCanvas = function (a, b, c, d) {
            this.canvasX = a, this.canvasY = b, this.canvasScaleX = c, this.canvasScaleY = d
        }, a.prototype.hitDown = function (a, b, c) {
            if (!this.pauseIsOn) {
                var d = (new Date).getTime();
                if (!(d - this.prevHitTime < 500 && isBugBrowser)) {
                    this.prevHitTime = d, a.preventDefault(), a.stopPropagation(), b = (b - this.canvasX) * this.canvasScaleX, c = (c - this.canvasY) * this.canvasScaleY;
                    for (var e = 0; e < this.aHitAreas.length; e++)
                        if (this.aHitAreas[e].rect && b > this.aHitAreas[e].area[0] && c > this.aHitAreas[e].area[1] && b < this.aHitAreas[e].area[2] && c < this.aHitAreas[e].area[3]) {
                            this.aHitAreas[e].oData.hitX = b, this.aHitAreas[e].oData.hitY = c, this.aHitAreas[e].callback(this.aHitAreas[e].id, this.aHitAreas[e].oData);
                            break
                        }
                }
            }
        }, a.prototype.hitUp = function (a) {
            a.preventDefault(), a.stopPropagation()
        }, a.prototype.addHitArea = function (a, b, c, d, e) {
            switch ("undefined" == typeof e && (e = !1), null == c && (c = new Object), e && this.removeHitArea(a), d.type) {
            case "image":
                d.oImageData.isSpriteSheet ? this.aHitAreas.push({
                    id: a,
                    callback: b,
                    oData: c,
                    rect: !0,
                    area: [d.aCentrePos[0] - d.oImageData.oData.spriteHeight / 2, d.aCentrePos[1] - d.oImageData.oData.spriteHeight / 2, d.aCentrePos[0] + d.oImageData.oData.spriteWidth / 2, d.aCentrePos[1] + d.oImageData.oData.spriteHeight / 2]
                }) : this.aHitAreas.push({
                    id: a,
                    callback: b,
                    oData: c,
                    rect: !0,
                    area: [d.aCentrePos[0] - d.oImageData.img.width / 2, d.aCentrePos[1] - d.oImageData.img.height / 2, d.aCentrePos[0] + d.oImageData.img.width / 2, d.aCentrePos[1] + d.oImageData.img.height / 2]
                });
                break;
            case "rect":
                this.aHitAreas.push({
                    id: a,
                    callback: b,
                    oData: c,
                    rect: !0,
                    area: d.aRect
                })
            }
        }, a.prototype.removeHitArea = function (a) {
            for (var b = 0; b < this.aHitAreas.length; b++) this.aHitAreas[b].id == a && (this.aHitAreas.splice(b, 1), b -= 1)
        }, a
    }();
    a.UserInput = b
}(Utils || (Utils = {}));
var Utils;
! function (a) {
    var b = function () {
        function a(a) {
            this.updateFreq = 10, this.updateInc = 0, this.frameAverage = 0, this.display = 1, this.log = "", this.render = function (a) {
                this.frameAverage += this.delta / this.updateFreq, ++this.updateInc >= this.updateFreq && (this.updateInc = 0, this.display = this.frameAverage, this.frameAverage = 0), a.textAlign = "left", ctx.font = "10px Helvetica", a.fillStyle = "#333333", a.beginPath(), a.rect(0, this.canvasHeight - 15, 40, 15), a.closePath(), a.fill(), a.fillStyle = "#ffffff", a.fillText(Math.round(1e3 / (1e3 * this.display)) + " fps " + this.log, 5, this.canvasHeight - 5)
            }, this.canvasHeight = a
        }
        return a.prototype.update = function (a) {
            this.delta = a
        }, a
    }();
    a.FpsMeter = b
}(Utils || (Utils = {}));
var Elements;
! function (a) {
    var b = function () {
        function a(a, b, c) {
            this.oImgData = a, this.canvasWidth = b, this.canvasHeight = c
        }
        return a.prototype.update = function () {}, a.prototype.render = function (a) {
            a.drawImage(this.oImgData.bg.img, 0, 0);
			a.drawImage(this.oImgData['sound'+(muted ?0:1)].img, 452, 0,80,80);
        }, a
    }();
    a.Background = b
}(Elements || (Elements = {}));
var Elements;
! function (a) {
    var b = function () {
        function a(a, b, c, d) {
            this.incY = 0, this.score = 0, this.highestScore = 0, this.posY = 0, this.oScreens = a, this.oButs = b, this.canvasWidth = c, this.canvasHeight = d, this.posY = -this.canvasHeight
        }
        return a.prototype.setRenderFunc = function (a) {
            switch (this.posY = -this.canvasHeight, a) {
            case "start":
                this.renderFunc = this.renderStartScreen, EngineLite.to(this, .5, {
                    posY: 0
                });
                break;
            case "help":
                break;
            case "end":
            }
        }, a.prototype.render = function (a, b) {
            this.renderFunc(a, b)
        }, a.prototype.renderStartScreen = function (a, b) {
            this.incY += 5 * b;
			a.drawImage(this.oScreens.startImageData.img, 0, 0);
			a.drawImage(this.oScreens['sound'+(muted ?0:1)].img, 452, 0,80,80);
			a.drawImage(this.oButs.play.imageData.img, this.oButs.play.pos[0] - this.oButs.play.imageData.img.width / 2, this.oButs.play.pos[1] - this.oButs.play.imageData.img.height / 2 - 5 * Math.sin(this.incY) - this.posY);
        }, a
    }();
    a.Screens = b
}(Elements || (Elements = {}));
var Elements;
! function (a) {
    var b = function () {
        function a(a, b, c) {
            this.inc = 0, this.oSplashScreenImgData = a, this.canvasWidth = b, this.canvasHeight = c, this.posY = this.canvasHeight, EngineLite.to(this, .7, {
                posY: 0,
                ease: "Power2.easeOut"
            })
        }
        return a.prototype.render = function (a) {
            a.drawImage(this.oSplashScreenImgData.img, 0, this.posY)
        }, a
    }();
    a.Splash = b
}(Elements || (Elements = {}));
var Elements;
! function (a) {
    var b = function () {
        function a(a, b, c, d) {
            this.frameNum = 0, this.x = 0, this.y = 0, this.playerHandTotal1 = 0, this.playerHandTotal2 = 0, this.compHandTotal = 0, this.letterSpace = 17, this.handSide = "right", this.oPanelsImgData = a, this.oNumbersImgData = b, this.canvasWidth = c, this.canvasHeight = d
        }
        return a.prototype.setUp = function (a, b) {
            switch ("undefined" == typeof b && (b = null), this.type = a, this.type) {
            case "betting":
                this.aPanels = new Array({
                    id: 0,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }, {
                    id: 7,
                    posX: this.canvasWidth,
                    posY: 385
                }), this.renderFunc = this.renderInGame, EngineLite.to(this.aPanels[0], .5, {
                    posY: -20
                });
                break;
            case "firstDeal":
                this.hideDealBut(), this.renderFunc = this.renderInGame, EngineLite.to(this.aPanels[0], .5, {
                    posY: -160,
                    onComplete: this.hideDealTweenComplete,
                    onCompleteParams: [this]
                }), "blackjack" != b.dealType && (this.insuranceIsOn = b.insuranceIsOn), this.insuranceIsOn && (this.aPanels.push({
                    id: 8,
                    posX: -380,
                    posY: 200
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .5, {
                    posX: -225,
                    delay: 1
                })), this.aPanels.push({
                    id: 4,
                    posX: this.canvasWidth,
                    posY: 420
                }), this.playerValuePanel1 = this.aPanels[this.aPanels.length - 1], EngineLite.to(this.aPanels[this.aPanels.length - 1], .5, {
                    posX: 445,
                    delay: 1
                }), this.playerHandTotal1 = b.value, "blackjack" == dealType ? (this.actionCompleteCallback = b.callback, EngineLite.to(this.aPanels[this.aPanels.length - 1], .5, {
                    posX: 445,
                    delay: 1,
                    onComplete: this.blackjackDealComplete,
                    onCompleteParams: [this]
                })) : EngineLite.to(this.aPanels[this.aPanels.length - 1], .5, {
                    posX: 445,
                    delay: 1
                });
                break;
            case "newPlayerCard":
                "right" == this.handSide ? this.playerHandTotal1 = b.value : this.playerHandTotal2 = b.value;
                for (var c = 0; c < this.aPanels.length; c++) this.insuranceIsOn && 8 == this.aPanels[c].id && EngineLite.to(this.aPanels[c], .5, {
                    posX: -380
                });
                break;
            case "newCompCard":
                this.compHandTotal = b.value;
                break;
            case "bust":
                try {
                    gradle.event('gamecomplete');
                } catch (e) {
                    console.log("GRADLE_GAMECOMPLETE not implemented.");
                }
                this.aPanels.push({
                    id: 3,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], 1, {
                    posY: 213,
                    delay: 1,
                    ease: "Back.easeOut"
                }), this.aPanels.push({
                    id: 9,
                    posX: this.canvasWidth,
                    posY: 385
                }), EngineLite.killTweensOf(this.aPanels[this.aPanels.length - 1]), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posX: 383,
                    delay: 2.3
                }), "right" == this.handSide && EngineLite.to(this.playerValuePanel1, .3, {
                    posX: this.canvasWidth,
                    delay: 2
                }), b.bank < 5 && (this.aPanels.push({
                    id: 14,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: this.canvasHeight
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posY: 600,
                    delay: 2,
                    ease: "Back.easeOut"
                }));
                break;
            case "blackjack":
                try {
                    gradle.event('blackjack');
                } catch (e) {
                    console.log("GRADLE_GAMECOMPLETE not implemented.");
                }
                this.aPanels.push({
                    id: 1,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], 1, {
                    posY: 213,
                    delay: 1,
                    ease: "Elastic.easeOut"
                }), this.aPanels.push({
                    id: 9,
                    posX: this.canvasWidth,
                    posY: 385
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posX: 383,
                    delay: 2.3
                });
                for (var c = 0; c < this.aPanels.length; c++)
                    if (4 == this.aPanels[c].id) {
                        EngineLite.to(this.aPanels[c], .3, {
                            posX: this.canvasWidth,
                            delay: 2
                        });
                        break
                    }
                for (var c = 0; c < this.aPanels.length; c++) this.insuranceIsOn && 8 == this.aPanels[c].id && EngineLite.to(this.aPanels[c], .5, {
                    posX: -380
                });
                break;
            case "push":
                this.aPanels.push({
                    id: 6,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], 1, {
                    posY: 213,
                    delay: 1,
                    ease: "Back.easeOut"
                }), this.aPanels.push({
                    id: 9,
                    posX: this.canvasWidth,
                    posY: 385
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posX: 383,
                    delay: 2.3
                });
                for (var c = 0; c < this.aPanels.length; c++)
                    if (4 == this.aPanels[c].id) {
                        EngineLite.to(this.aPanels[c], .3, {
                            posX: this.canvasWidth,
                            delay: 2
                        });
                        break
                    }
                for (var c = 0; c < this.aPanels.length; c++) this.insuranceIsOn && 8 == this.aPanels[c].id && EngineLite.to(this.aPanels[c], .5, {
                    posX: -380
                });
                break;
            case "compPlay":
                this.aPanels.push({
                    id: 5,
                    posX: this.canvasWidth,
                    posY: 80
                }), this.compValuePanel = this.aPanels[this.aPanels.length - 1], EngineLite.to(this.aPanels[this.aPanels.length - 1], .5, {
                    posX: 445,
                    delay: 1
                }), this.compHandTotal = b.value;
                break;
            case "insuranceTaken":
                for (var c = 0; c < this.aPanels.length; c++) this.insuranceIsOn && 8 == this.aPanels[c].id && EngineLite.to(this.aPanels[c], .5, {
                    posX: -380
                });
                break;
            case "insuranceLose":
                for (var c = 0; c < this.aPanels.length; c++) this.insuranceIsOn && 8 == this.aPanels[c].id && EngineLite.to(this.aPanels[c], .5, {
                    posX: -380
                });
                try {
                    gradle.event('insuranceLose');
                } catch (e) {
                    console.log("GRADLE_GAMECOMPLETE not implemented.");
                }
                this.aPanels.push({
                    id: 13,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .5, {
                    posY: -20
                });
                break;
            case "hidePlayOn":
                for (var c = 0; c < this.aPanels.length; c++) 13 == this.aPanels[c].id && EngineLite.to(this.aPanels[c], .5, {
                    posY: -160
                });
                break;
            case "insuranceWin":
                try {
                    gradle.event('insuranceWin');
                } catch (e) {
                    console.log("GRADLE_GAMECOMPLETE not implemented.");
                }
                this.aPanels.push({
                    id: 10,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], 1, {
                    posY: 213,
                    ease: "Back.easeOut"
                }), this.aPanels.push({
                    id: 9,
                    posX: this.canvasWidth,
                    posY: 385
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posX: 383,
                    delay: 1.3
                });
                for (var c = 0; c < this.aPanels.length; c++)
                    if (4 == this.aPanels[c].id) {
                        EngineLite.to(this.aPanels[c], .3, {
                            posX: this.canvasWidth,
                            delay: 1
                        });
                        break
                    }
                break;
            case "playerWin":
                try {
                    gradle.event('playerWin');
                } catch (e) {
                    console.log("GRADLE_GAMECOMPLETE not implemented.");
                }
                this.aPanels.push({
                    id: 12,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], 1, {
                    posY: 213,
                    ease: "Back.easeOut"
                }), this.aPanels.push({
                    id: 9,
                    posX: this.canvasWidth,
                    posY: 385
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posX: 383,
                    delay: 1.3
                });
                for (var c = 0; c < this.aPanels.length; c++)
                    if (4 == this.aPanels[c].id) {
                        EngineLite.to(this.aPanels[c], .3, {
                            posX: this.canvasWidth,
                            delay: 1
                        });
                        break
                    }
                break;
            case "compWin":
                try {
                    gradle.event('compWin');
                } catch (e) {
                    console.log("GRADLE_GAMECOMPLETE not implemented.");
                }
                this.aPanels.push({
                    id: 11,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], 1, {
                    posY: 213,
                    ease: "Back.easeOut"
                }), this.aPanels.push({
                    id: 9,
                    posX: this.canvasWidth,
                    posY: 385
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posX: 383,
                    delay: 1.3
                });
                for (var c = 0; c < this.aPanels.length; c++)
                    if (4 == this.aPanels[c].id) {
                        EngineLite.to(this.aPanels[c], .3, {
                            posX: this.canvasWidth,
                            delay: 1
                        });
                        break
                    }
                b.bank < 5 && (this.aPanels.push({
                    id: 14,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: this.canvasHeight
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posY: 600,
                    delay: 2,
                    ease: "Back.easeOut"
                }));
                break;
            case "compBust":
                try {
                    gradle.event('compBust');
                } catch (e) {
                    console.log("GRADLE_GAMECOMPLETE not implemented.");
                }
                this.aPanels.push({
                    id: 2,
                    posX: this.canvasWidth / 2 - this.oPanelsImgData.oData.spriteWidth / 2,
                    posY: -160
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], 1, {
                    posY: 213,
                    ease: "Back.easeOut"
                }), this.aPanels.push({
                    id: 9,
                    posX: this.canvasWidth,
                    posY: 385
                }), EngineLite.to(this.aPanels[this.aPanels.length - 1], .3, {
                    posX: 383,
                    delay: 1.3
                });
                for (var c = 0; c < this.aPanels.length; c++)
                    if (4 == this.aPanels[c].id) {
                        EngineLite.to(this.aPanels[c], .3, {
                            posX: this.canvasWidth,
                            delay: 1
                        });
                        break
                    }
                break;
            case "split":
                this.playerHandTotal1 = b.playerHandTotal2, this.playerHandTotal2 = b.playerHandTotal1;
                for (var c = 0; c < this.aPanels.length; c++) this.insuranceIsOn && 8 == this.aPanels[c].id && EngineLite.to(this.aPanels[c], .5, {
                    posX: -380
                });
                EngineLite.to(this.playerValuePanel1, .3, {
                    posX: this.canvasWidth
                }), this.aPanels.push({
                    id: 4,
                    posX: -379,
                    posY: 420
                }), this.playerValuePanel2 = this.aPanels[this.aPanels.length - 1], EngineLite.to(this.playerValuePanel2, .3, {
                    posX: -291
                }), this.handSide = "left";
                break;
            case "switchHands":
                this.handSide = "right", this.actionCompleteCallback = b.callback, EngineLite.to(this.playerValuePanel1, .3, {
                    posX: 445,
                    delay: .5,
                    onComplete: this.panelSwitchRight,
                    onCompleteParams: [this]
                }), "bust" == b.event && EngineLite.to(this.playerValuePanel2, .3, {
                    posX: -379,
                    delay: .5
                })
            }
        }, a.prototype.panelSwitchRight = function (a) {
            a.actionCompleteCallback()
        }, a.prototype.blackjackDealComplete = function (a) {
            a.actionCompleteCallback()
        }, a.prototype.hideDealTweenComplete = function (a) {
            for (var b = 0; b < a.aPanels.length; b++)(0 == a.aPanels[b].id || 7 == a.aPanels[b].id) && (a.aPanels.splice(b, 1), b -= 1)
        }, a.prototype.showDealBut = function () {
            EngineLite.killTweensOf(this.aPanels[1]), EngineLite.to(this.aPanels[1], .5, {
                posX: 383
            })
        }, a.prototype.hideDealBut = function () {
            EngineLite.killTweensOf(this.aPanels[1]), EngineLite.to(this.aPanels[1], .5, {
                posX: this.canvasWidth
            })
        }, a.prototype.render = function (a) {
            this.renderFunc(a)
        }, a.prototype.renderInGame = function (a) {
            for (var b = 0; b < this.aPanels.length; b++) {
                var c = this.aPanels[b].id * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                    d = Math.floor(this.aPanels[b].id / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                a.drawImage(this.oPanelsImgData.img, c, d, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, this.aPanels[b].posX, this.aPanels[b].posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight)
            }
            if (this.playerHandTotal1 > 0)
                for (var b = 0; b < this.playerHandTotal1.toString().length; b++) {
                    var f, e = parseFloat(this.playerHandTotal1.toString().charAt(b)),
                        c = e * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                        d = Math.floor(e / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    f = b * this.letterSpace + 50 - this.letterSpace * this.playerHandTotal1.toString().length / 2, a.drawImage(this.oNumbersImgData.img, c, d, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, this.playerValuePanel1.posX + f, this.playerValuePanel1.posY + 60, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight)
                }
            if (this.playerHandTotal2 > 0)
                for (var b = 0; b < this.playerHandTotal2.toString().length; b++) {
                    var f, e = parseFloat(this.playerHandTotal2.toString().charAt(b)),
                        c = e * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                        d = Math.floor(e / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    f = b * this.letterSpace + 329 - this.letterSpace * this.playerHandTotal2.toString().length / 2, a.drawImage(this.oNumbersImgData.img, c, d, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, this.playerValuePanel2.posX + f, this.playerValuePanel2.posY + 60, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight)
                }
            if (this.compHandTotal > 0)
                for (var b = 0; b < this.compHandTotal.toString().length; b++) {
                    var e = parseFloat(this.compHandTotal.toString().charAt(b)),
                        c = e * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                        d = Math.floor(e / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oNumbersImgData.img, c, d, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, this.compValuePanel.posX + b * this.letterSpace + 50 - this.letterSpace * this.compHandTotal.toString().length / 2, this.compValuePanel.posY + 60, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight)
                }
        }, a
    }();
    a.Panel = b
}(Elements || (Elements = {}));
var Elements;
! function (a) {
    var b = function () {
        function a(a, b, c) {
            this.bet = 0, this.bank = 0, this.letterSpace = 17, this.oNumbersImgData = a, this.canvasWidth = b, this.canvasHeight = c
        }
        return a.prototype.setAmounts = function (a, b) {
            this.bet = a, this.bank = b
        }, a.prototype.render = function (a) {
            for (var b = 0; b < this.bet.toString().length; b++) {
                var c = parseFloat(this.bet.toString().charAt(b)),
                    d = c * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                    e = Math.floor(c / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                a.drawImage(this.oNumbersImgData.img, d, e, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, 75 + b * this.letterSpace, 580, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight)
            }
            for (var b = 0; b < this.bank.toString().length; b++) {
                var c = parseFloat(this.bank.toString().charAt(b)),
                    d = c * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                    e = Math.floor(c / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                a.drawImage(this.oNumbersImgData.img, d, e, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, 232 + b * this.letterSpace, 761, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight)
            }
        }, a
    }();
    a.Numbers = b
}(Elements || (Elements = {}));
var Elements;
! function (a) {
    var b = function () {
        function a(a, b, c, d) {
            this.bet = 0, this.bank = 0, this.oChipImgData = a, this.aChipAmounts = b, this.canvasWidth = c, this.canvasHeight = d, this.aChipStacks = new Array({
                targX: 3,
                targY: 630,
                x: 200,
                y: 800
            }, {
                targX: 133,
                targY: 630,
                x: 200,
                y: 800
            }, {
                targX: 266,
                targY: 630,
                x: 200,
                y: 800
            }, {
                targX: 399,
                targY: 630,
                x: 200,
                y: 800
            })
        }
        return a.prototype.setAmounts = function (a, b) {
            this.bet = a, this.bank = b
        }, a.prototype.updateChipStacks = function () {
            this.bank < 5 ? (this.aChipStacks[0].y = 800, this.aChipStacks[1].y = 800, this.aChipStacks[2].y = 800, this.aChipStacks[3].y = 800) : (this.aChipStacks[0].y = this.aChipStacks[0].targY, this.bank < 10 ? (this.aChipStacks[1].y = 800, this.aChipStacks[2].y = 800, this.aChipStacks[3].y = 800) : (this.aChipStacks[1].y = this.aChipStacks[1].targY, this.bank < 25 ? (this.aChipStacks[2].y = 800, this.aChipStacks[3].y = 800) : (this.aChipStacks[2].y = this.aChipStacks[2].targY, this.aChipStacks[3].y = this.bank < 100 ? 800 : this.aChipStacks[3].targY)))
        }, a.prototype.setUp = function (a) {
            switch (a) {
            case "betting":
                this.aBetChips = new Array, this.renderFunc = this.renderStart;
                var b;
                this.bank >= 100 ? b = 4 : this.bank >= 25 ? b = 3 : this.bank >= 10 ? b = 2 : this.bank >= 5 && (b = 1);
                for (var c = 0; b > c; c++) EngineLite.to(this.aChipStacks[c], .5, {
                    y: this.aChipStacks[c].targY,
                    x: this.aChipStacks[c].targX,
                    ease: "Back.easeOut",
                    delay: .1 * c
                });
                break;
            case "firstDeal":
                this.renderFunc = this.renderSmall, this.aSmallBetChips = new Array;
                for (var c = 0; c < Math.min(this.aBetChips.length, 5); c++) {
                    var d = {
                        id: this.aBetChips[this.aBetChips.length - c - 1],
                        posX: 170 + c * 3 * c + 1 * c,
                        posY: 400,
                        scale: 1
                    };
                    this.aSmallBetChips.push(d), EngineLite.killTweensOf(this), EngineLite.to(this.aSmallBetChips[c], .3, {
                        scale: .5,
                        posX: 90 * Math.random() + 190,
                        posY: 10 * Math.random() + 550,
                        delay: .1 * c
                    })
                }
                for (var c = 0; c < this.aChipStacks.length; c++) EngineLite.to(this.aChipStacks[c], .3, {
                    y: 800,
                    x: 200,
                    delay: .1 * c
                });
                break;
            case "double":
                this.renderFunc = this.renderDouble, this.aDoubleBetChips = new Array;
                for (var c = 0; c < this.aSmallBetChips.length; c++) {
                    var d = {
                        id: this.aSmallBetChips[c].id,
                        posX: 200,
                        posY: 800,
                        scale: 1
                    };
                    this.aDoubleBetChips.push(d), EngineLite.to(this.aDoubleBetChips[c], .5, {
                        posX: 90 * Math.random() + 190,
                        posY: 10 * Math.random() + 550,
                        ease: "Back.easeOut",
                        delay: .3 + .1 * c
                    })
                }
            }
        }, a.prototype.addChip = function (a, b, c) {
            this.setAmounts(b, c), this.updateChipStacks(), this.curChipX = this.aChipStacks[a].targX, this.curChipY = this.aChipStacks[a].targY, this.curChipId = a;
            var d = Math.min(this.aBetChips.length, 4);
            EngineLite.killTweensOf(this), EngineLite.to(this, .3, {
                curChipX: 170 + d * 3 * d + 1 * d,
                curChipY: 400,
                ease: "Back.easeOut",
                onComplete: this.betTweenComplete,
                onCompleteParams: [this]
            }), this.aBetChips.push(a), this.renderFunc = this.renderAdding
        }, a.prototype.betTweenComplete = function (a) {
            a.renderFunc = a.renderWaiting
        }, a.prototype.removeChip = function (a, b) {
            this.setAmounts(a, b), this.updateChipStacks();
            var c = Math.min(this.aBetChips.length, 4);
            this.curChipX = 170 + c * 3 * c + 1 * c, this.curChipY = 400, this.curChipId = this.aBetChips[this.aBetChips.length - 1], this.aBetChips.pop(), EngineLite.killTweensOf(this), EngineLite.to(this, .3, {
                curChipX: this.aChipStacks[this.curChipId].targX,
                curChipY: this.aChipStacks[this.curChipId].targY,
                ease: "Back.easeIn",
                onComplete: this.betTweenComplete,
                onCompleteParams: [this]
            }), this.renderFunc = this.renderRemoving
        }, a.prototype.render = function (a) {
            this.renderFunc(a)
        }, a.prototype.renderStart = function (a) {
            for (var b = 0; b < this.aChipStacks.length; b++) {
                var c = b * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(b / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.aChipStacks[b].x, this.aChipStacks[b].y, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
            }
        }, a.prototype.renderAdding = function (a) {
            for (var b = 0; b < this.aChipStacks.length; b++) {
                var c = b * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(b / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.aChipStacks[b].x, this.aChipStacks[b].y, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
            }
            for (var b = 0; b < Math.min(this.aBetChips.length - 1, 4); b++) {
                var e = this.aBetChips[this.aBetChips.length - 1 - Math.min(this.aBetChips.length - 1, 4) + b],
                    c = e * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(e / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, 170 + b * 3 * b + 1 * b, 400, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
            }
            var c = this.curChipId * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                d = Math.floor(this.curChipId / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
            a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.curChipX, this.curChipY, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
        }, a.prototype.renderRemoving = function (a) {
            for (var b = 0; b < this.aChipStacks.length; b++) {
                var c = b * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(b / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.aChipStacks[b].x, this.aChipStacks[b].y, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
            }
            for (var b = 0; b < Math.min(this.aBetChips.length, 4); b++) {
                var e = this.aBetChips[this.aBetChips.length - Math.min(this.aBetChips.length, 4) + b],
                    c = e * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(e / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, 170 + b * 3 * b + 1 * b, 400, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
            }
            var c = this.curChipId * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                d = Math.floor(this.curChipId / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
            a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.curChipX, this.curChipY, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
        }, a.prototype.renderWaiting = function (a) {
            for (var b = 0; b < this.aChipStacks.length; b++) {
                var c = b * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(b / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.aChipStacks[b].x, this.aChipStacks[b].y, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
            }
            for (var b = 0; b < Math.min(this.aBetChips.length, 5); b++) {
                var e = this.aBetChips[this.aBetChips.length - Math.min(this.aBetChips.length, 5) + b],
                    c = e * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(e / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, 170 + b * 3 * b + 1 * b, 400, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
            }
        }, a.prototype.renderSmall = function (a) {
            for (var b = 0; b < this.aChipStacks.length; b++) {
                var c = b * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(b / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.aChipStacks[b].x, this.aChipStacks[b].y, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight)
            }
            for (var b = 0; b < this.aSmallBetChips.length; b++) {
                var e = this.aSmallBetChips[b].id,
                    c = e * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    d = Math.floor(e / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, c, d, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.aSmallBetChips[b].posX, this.aSmallBetChips[b].posY, this.oChipImgData.oData.spriteWidth * this.aSmallBetChips[b].scale, this.oChipImgData.oData.spriteHeight * this.aSmallBetChips[b].scale)
            }
        }, a.prototype.renderDouble = function (a) {
            for (var b = 0; b < this.aSmallBetChips.length; b++) {
                var c = this.aSmallBetChips[b].id,
                    d = c * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    e = Math.floor(c / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, d, e, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.aSmallBetChips[b].posX, this.aSmallBetChips[b].posY, this.oChipImgData.oData.spriteWidth * this.aSmallBetChips[b].scale, this.oChipImgData.oData.spriteHeight * this.aSmallBetChips[b].scale)
            }
            for (var b = 0; b < this.aDoubleBetChips.length; b++) {
                var c = this.aDoubleBetChips[b].id,
                    d = c * this.oChipImgData.oData.spriteWidth % this.oChipImgData.img.width,
                    e = Math.floor(c / (this.oChipImgData.img.width / this.oChipImgData.oData.spriteWidth)) * this.oChipImgData.oData.spriteHeight;
                a.drawImage(this.oChipImgData.img, d, e, this.oChipImgData.oData.spriteWidth, this.oChipImgData.oData.spriteHeight, this.aDoubleBetChips[b].posX, this.aDoubleBetChips[b].posY, this.oChipImgData.oData.spriteWidth * this.aSmallBetChips[b].scale, this.oChipImgData.oData.spriteHeight * this.aSmallBetChips[b].scale)
            }
        }, a
    }();
    a.Chips = b
}(Elements || (Elements = {}));
var Elements;
! function (a) {
    var b = function () {
        function a(a, b, c) {
            this.centreId = 0, this.oCardsImgData = a, this.canvasWidth = b, this.canvasHeight = c
        }
        return a.prototype.setUp = function (a, b) {
            switch ("undefined" == typeof b && (b = null), a) {
            case "firstDeal":
                this.aPlayerCards1 = new Array, this.aPlayerCards2 = new Array, this.aCurPlayerCards = this.aPlayerCards1, this.aCompCards = new Array, this.aCurPlayerCards.push({
                    id: b.aPlayerDealtCards[0].id,
                    posX: 200,
                    posY: -200,
                    rotation: 0
                }), this.aCurPlayerCards.push({
                    id: b.aPlayerDealtCards[1].id,
                    posX: 200,
                    posY: -200,
                    rotation: 0
                }), this.aCompCards.push({
                    id: b.aCompDealtCards[0].id,
                    posX: 200,
                    posY: -200,
                    rotation: 0,
                    scaleX: 1
                }), this.aCompCards.push({
                    id: 52,
                    posX: 200,
                    posY: -200,
                    rotation: 0,
                    scaleX: 1
                });
                for (var c = 0; c < this.aCurPlayerCards.length; c++) {
                    var d = this.getCentreX(c, this.aCurPlayerCards.length, this.centreId);
                    EngineLite.to(this.aCurPlayerCards[c], 1, {
                        rotation: this.getRotation(d),
                        posX: this.getCentreX(c, this.aCurPlayerCards.length, this.centreId),
                        posY: 460,
                        delay: .1 * c
                    });
                    var d = this.getCentreX(c, this.aCompCards.length, this.centreId);
                    EngineLite.to(this.aCompCards[c], 1, {
                        rotation: this.getRotation(d),
                        posX: this.getCentreX(c, this.aCompCards.length, this.centreId),
                        posY: 130,
                        delay: .1 * c + .2
                    })
                }
                break;
            case "newPlayerCard":
                this.aCurPlayerCards.push({
                    id: b.newCard.id,
                    posX: 200,
                    posY: -200,
                    rotation: 0
                });
                for (var c = 0; c < this.aCurPlayerCards.length; c++) {
                    var d = this.getCentreX(c, this.aCurPlayerCards.length, this.centreId);
                    if (b.callback && c == this.aCurPlayerCards.length - 1) {
                        this.actionCompleteCallback = b.callback, EngineLite.to(this.aCurPlayerCards[c], 1, {
                            rotation: this.getRotation(d),
                            posX: d,
                            posY: 460,
                            onComplete: this.handComplete,
                            onCompleteParams: [this]
                        });
                        break
                    }
                    EngineLite.to(this.aCurPlayerCards[c], 1, {
                        rotation: this.getRotation(d),
                        posX: d,
                        posY: 460
                    })
                }
                break;
            case "newCompCard":
                this.centreId = 0, this.aCompCards.push({
                    id: b.oNewCard.id,
                    posX: 200,
                    posY: -200,
                    rotation: 0,
                    scaleX: 1
                });
                for (var c = 0; c < this.aCompCards.length; c++) {
                    var d = this.getCentreX(c, this.aCompCards.length, this.centreId);
                    if (b.callback && c == this.aCompCards.length - 1) {
                        this.actionCompleteCallback = b.callback, EngineLite.to(this.aCompCards[c], 1, {
                            rotation: this.getRotation(d),
                            posX: d,
                            posY: 130,
                            onComplete: this.handComplete,
                            onCompleteParams: [this]
                        });
                        break
                    }
                    EngineLite.to(this.aCompCards[c], 1, {
                        rotation: this.getRotation(d),
                        posX: d,
                        posY: 130
                    })
                }
                break;
            case "compPlay":
                this.centreId = 0, EngineLite.to(this.aCompCards[1], .5, {
                    scaleX: 0,
                    ease: "Power1.easeIn"
                }), this.aCompCards.push({
                    id: b.oHoleCard.id,
                    posX: this.aCompCards[1].posX,
                    posY: this.aCompCards[1].posY,
                    rotation: this.aCompCards[1].rotation,
                    scaleX: 0
                }), EngineLite.to(this.aCompCards[2], .5, {
                    scaleX: 1,
                    delay: .5,
                    onComplete: this.holeCardRevealComplete,
                    onCompleteParams: [this]
                }), this.actionCompleteCallback = b.callback;
                break;
            case "compShow":
                this.centreId = 0, EngineLite.to(this.aCompCards[1], .5, {
                    scaleX: 0,
                    ease: "Power1.easeIn"
                }), this.aCompCards.push({
                    id: b.oHoleCard.id,
                    posX: this.aCompCards[1].posX,
                    posY: this.aCompCards[1].posY,
                    rotation: this.aCompCards[1].rotation,
                    scaleX: 0
                }), EngineLite.to(this.aCompCards[2], .5, {
                    scaleX: 1,
                    delay: .5
                });
                break;
            case "compInsuranceShow":
                this.centreId = 0, EngineLite.to(this.aCompCards[1], .5, {
                    scaleX: 0,
                    ease: "Power1.easeIn"
                }), this.aCompCards.push({
                    id: b.oHoleCard.id,
                    posX: this.aCompCards[1].posX,
                    posY: this.aCompCards[1].posY,
                    rotation: this.aCompCards[1].rotation,
                    scaleX: 0
                }), EngineLite.to(this.aCompCards[2], .5, {
                    scaleX: 1,
                    delay: .5,
                    onComplete: this.holeCardRevealComplete,
                    onCompleteParams: [this]
                }), this.actionCompleteCallback = b.callback;
                break;
            case "split":
                this.aPlayerCards2 = new Array(this.aPlayerCards1.pop()), this.centreId = 1;
                var d = this.getCentreX(0, this.aCurPlayerCards.length, 1);
                EngineLite.to(this.aCurPlayerCards[0], .5, {
                    rotation: this.getRotation(d),
                    posX: d
                });
                var d = this.getCentreX(0, this.aPlayerCards2.length, 2);
                EngineLite.to(this.aPlayerCards2[0], .5, {
                    rotation: this.getRotation(d),
                    posX: d
                });
                break;
            case "switchHands":
                this.centreId = 2, this.aCurPlayerCards = this.aPlayerCards2
            }
        }, a.prototype.handComplete = function (a) {
            a.actionCompleteCallback()
        }, a.prototype.holeCardRevealComplete = function (a) {
            for (var b = 0; b < a.aCompCards.length; b++) 52 == a.aCompCards[b].id && a.aCompCards.splice(b, 1);
            a.actionCompleteCallback()
        }, a.prototype.getCentreX = function (a, b, c) {
            "undefined" == typeof c && (c = 0);
            var d = this.canvasWidth / 2,
                e = 50;
            return 1 == c ? (d = this.canvasWidth / 4, e = 25) : 2 == c && (d = 3 * (this.canvasWidth / 4), e = 25), d + a * e - (b - 1) * e / 2
        }, a.prototype.getRotation = function (a) {
            return Math.PI / 8 / this.canvasWidth * a - Math.PI / 16
        }, a.prototype.render = function (a) {
            for (var b = 0; b < this.aCompCards.length; b++) {
                a.save(), a.translate(this.aCompCards[b].posX, this.aCompCards[b].posY), a.rotate(this.aCompCards[b].rotation);
                var c = this.aCompCards[b].id,
                    d = c * this.oCardsImgData.oData.spriteWidth % this.oCardsImgData.img.width,
                    e = Math.floor(c / (this.oCardsImgData.img.width / this.oCardsImgData.oData.spriteWidth)) * this.oCardsImgData.oData.spriteHeight;
                a.drawImage(this.oCardsImgData.img, d, e, this.oCardsImgData.oData.spriteWidth, this.oCardsImgData.oData.spriteHeight, -this.oCardsImgData.oData.spriteWidth / 2 + (1 - this.aCompCards[b].scaleX) * (this.oCardsImgData.oData.spriteWidth / 2), -this.oCardsImgData.oData.spriteHeight / 2, this.oCardsImgData.oData.spriteWidth * this.aCompCards[b].scaleX, this.oCardsImgData.oData.spriteHeight), a.restore()
            }
            for (var b = 0; b < this.aPlayerCards1.length; b++) {
                a.save(), ctx.translate(this.aPlayerCards1[b].posX, this.aPlayerCards1[b].posY), ctx.rotate(this.aPlayerCards1[b].rotation);
                var c = this.aPlayerCards1[b].id,
                    d = c * this.oCardsImgData.oData.spriteWidth % this.oCardsImgData.img.width,
                    e = Math.floor(c / (this.oCardsImgData.img.width / this.oCardsImgData.oData.spriteWidth)) * this.oCardsImgData.oData.spriteHeight;
                a.drawImage(this.oCardsImgData.img, d, e, this.oCardsImgData.oData.spriteWidth, this.oCardsImgData.oData.spriteHeight, -this.oCardsImgData.oData.spriteWidth / 2, -this.oCardsImgData.oData.spriteHeight / 2, this.oCardsImgData.oData.spriteWidth, this.oCardsImgData.oData.spriteHeight), a.restore()
            }
            for (var b = 0; b < this.aPlayerCards2.length; b++) {
                a.save(), ctx.translate(this.aPlayerCards2[b].posX, this.aPlayerCards2[b].posY), ctx.rotate(this.aPlayerCards2[b].rotation);
                var c = this.aPlayerCards2[b].id,
                    d = c * this.oCardsImgData.oData.spriteWidth % this.oCardsImgData.img.width,
                    e = Math.floor(c / (this.oCardsImgData.img.width / this.oCardsImgData.oData.spriteWidth)) * this.oCardsImgData.oData.spriteHeight;
                a.drawImage(this.oCardsImgData.img, d, e, this.oCardsImgData.oData.spriteWidth, this.oCardsImgData.oData.spriteHeight, -this.oCardsImgData.oData.spriteWidth / 2, -this.oCardsImgData.oData.spriteHeight / 2, this.oCardsImgData.oData.spriteWidth, this.oCardsImgData.oData.spriteHeight), a.restore()
            }
        }, a
    }();
    a.Cards = b
}(Elements || (Elements = {}));
var Elements;
! function (a) {
    var b = function () {
        function a(a, b, c) {
            this.canHit = !1, this.oButtonsImgData = a, this.canvasWidth = b, this.canvasHeight = c, this.aButs = new Array({
                targX: 3,
                targY: 630,
                x: 200,
                y: 800,
                isOn: !0
            }, {
                targX: 133,
                targY: 630,
                x: 200,
                y: 800,
                isOn: !0
            }, {
                targX: 266,
                targY: 630,
                x: 200,
                y: 800,
                isOn: !0
            }, {
                targX: 399,
                targY: 630,
                x: 200,
                y: 800,
                isOn: !0
            })
        }
        return a.prototype.setUp = function (a, b) {
            switch ("undefined" == typeof b && (b = null), a) {
            case "firstDeal":
                if ("blackjack" == b.dealType) return;
                "normal" == b.dealType && (this.aButs[0].isOn = !1), b.doubleIsOn || (this.aButs[1].isOn = !1);
                for (var c = 0; c < this.aButs.length; c++) this.aButs[c].isOn && EngineLite.to(this.aButs[c], .5, {
                    y: this.aButs[c].targY,
                    x: this.aButs[c].targX,
                    ease: "Back.easeOut",
                    delay: 1 + .1 * c,
                    onComplete: this.allowButs,
                    onCompleteParams: [this]
                });
                break;
            case "double":
            case "stand":
                for (var c = 0; c < this.aButs.length; c++) this.aButs[c].isOn && EngineLite.to(this.aButs[c], .3, {
                    y: 800,
                    x: 200,
                    delay: .1 * c
                });
                break;
            case "split":
            case "hit":
                for (var c = 0; 2 > c; c++) this.aButs[c].isOn && EngineLite.to(this.aButs[c], .3, {
                    y: 800,
                    x: 200,
                    delay: .1 * c
                });
                break;
            case "bust":
            case "insuranceWin":
                for (var c = 0; c < this.aButs.length; c++) this.aButs[c].isOn && EngineLite.to(this.aButs[c], .3, {
                    y: 800,
                    x: 200,
                    delay: 1 + .1 * c
                })
            }
        }, a.prototype.allowButs = function (a) {
            a.canHit = !0
        }, a.prototype.render = function (a) {
			
            for (var b = 0; b < this.aButs.length; b++)
                if (this.aButs[b].isOn) {
                    var c = b * this.oButtonsImgData.oData.spriteWidth % this.oButtonsImgData.img.width,
                        d = Math.floor(b / (this.oButtonsImgData.img.width / this.oButtonsImgData.oData.spriteWidth)) * this.oButtonsImgData.oData.spriteHeight;
                    a.drawImage(this.oButtonsImgData.img, c, d, this.oButtonsImgData.oData.spriteWidth, this.oButtonsImgData.oData.spriteHeight, this.aButs[b].x, this.aButs[b].y, this.oButtonsImgData.oData.spriteWidth, this.oButtonsImgData.oData.spriteHeight)
                }
        }, a
    }();
    a.Buttons = b
}(Elements || (Elements = {}));


var requestAnimFrame = function () {
        return function (a) {
            window.setTimeout(a, 900 / 30, (new Date).getTime())
        }
    }(),
    previousTime, canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
canvas.width = 533, canvas.height = 800;
var canvasX, canvasY, canvasScaleX, canvasScaleY, div = document.getElementById("viewporter"),
    sound, music, allowSound = !1,
    muted = !1,
    splash, splashTimer = 0,
    screens, assetLib, preAssetLib, rotatePause = !1,
    manualPause = !1,
    isMobile = !1,
    gameState = "loading",
    lang = "EN",
    isBugBrowser = !1,
    deviceAgent = navigator.userAgent.toLowerCase();
(deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/) || deviceAgent.match(/(iemobile)/) || deviceAgent.match(/iphone/i) || deviceAgent.match(/ipad/i) || deviceAgent.match(/ipod/i) || deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i)) && (isMobile = !0, deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent) && (isBugBrowser = !0));
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas(), window.onresize = function () {
    setTimeout(function () {
        resizeCanvas()
    }, 1)
}, window.addEventListener("load", function () {
    setTimeout(function () {
        resizeCanvas()
    }, 0), window.addEventListener("orientationchange", function () {
        resizeCanvas()
    }, !1)
}), ("undefined" != typeof window.AudioContext || "undefined" != typeof window.webkitAudioContext || -1 == navigator.userAgent.indexOf("Android")) && (allowSound = !0, sound = new Howl({
    urls: ["audio/sound.ogg", "audio/sound.m4a"],
    sprite: {
        click: [0, 150],
        cardHard: [250, 500],
        chip: [1e3, 300],
        bust: [1500, 750],
        win: [2500, 750],
        blackjack: [3500, 750],
        push: [4500, 750],
        cardSoft: [5500, 300],
        chipIntro: [6e3, 500]
    }
}));
var panel, background, bet = 0,
    bank = 0,
    numbers, chips, aChipAmounts = new Array(5, 10, 25, 100),
    cards, aDeck, dealType, buttons, aPCards1, aPCards2, aCurPlayerCards, aCompCards, insuranceTaken = !1,
    splitTaken = !1,
    insuranceCard;

document.body.style.backgroundImage="url('./images/back_menu.png')";


function _engine() {
	this.count = 0;
	this.cycleFlag = false;
	this.firstHPLoss = false;
	this.raidFlag = false;
	this.multiplier = 1;
	this.dayStatus = "Alacakaranlık";
	this.statusCycle = ["Gün","Alacakaranlık","Gece","Şafak"];
	this.dayFlavor = ["Dışarıda güneş parlak..","Güneş batıyor..","Ay pırıl pırıl parlıyor..","Güneş doğuyor.."];
	this.huntStatus = {"day":0,"dusk":3,"night":4,"dawn":2};
	this.player = (function(){ return new _player(); }());
	this.elements = (function(){ return new _element(); }());
}

_engine.prototype = {
	updateCount : function(e) {
		this.count++;
		this.elements.alterHTML(e,this.count);
		this.triggers(this.count);
	},
	triggers : function(c) {
		if (c == 1) this.elements.initCounter();
		if (c > 1) this.elements.pluralize("singularHours");
		if (c == 5) this.elements.bloodButton();
		if (!(c%3) && c >= 5) this.elements.enableButton("bloodButton","hunt","Kan için Av");
		if (!(c%5) && this.player.bloodcount > 5 && this.raidFlag) this.elements.enableButton("raidButton","raid","Altın için Baskın");
		if (this.player.bloodcount >= 10 && !this.raidFlag) {
			this.elements.raidButton();
			this.raidFlag = true;
		}
		if (this.player.bloodcount >= 5 && !this.cycleFlag) {
			this.initDayCycle();
			this.cycleFlag = true;
		}
		if (!(c%15) && this.cycleFlag) this.nextDayCycle();
		if (this.player.isDead() && this.dayStatus == "night") this.player.revive();
		if (this.player.goldCount > 50) {
			this.elements.showElement("middleCol","block");
		}
	},
	initDayCycle : function() {
		this.elements.showElement("divCycle","block");
		this.elements.alterHTML("cycle",this.dayStatus);
		this.multiplier = 3;
	},
	nextDayCycle : function() {
		var index = this.statusCycle.indexOf(this.dayStatus);
		var cycleNext = this.statusCycle[(index+1)];
		if (cycleNext) {
			this.dayStatus = cycleNext;
			this.multiplier = this.huntStatus[cycleNext];
		}
		else {
			this.dayStatus = this.statusCycle[0];
			this.multiplier = this.huntStatus[this.dayStatus];
		}
		this.elements.alterHTML("cycle",this.dayStatus);
		var newIndex = this.statusCycle.indexOf(this.dayStatus);
		this.elements.eventMsg(this.dayFlavor[newIndex]);
	}
}
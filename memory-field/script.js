var gSquares = {
	toMark: 3,
	clicksCount: 0,
	errorCount: 0,
	isActive: false,
	drawField: function(s){
		var html = '<div class="header"></div><table>';
		for(var i = 0; i < s; i++){
			html += '<tr>';
			for(var j = 0; j < s; j++){
				html += '<td></td>';
			}
			html += '</tr>';
		}
		html += '</table><div class="footer"></div><div class="controls"><button class="doRestart">Restart</button></div>';
		$('#field').html(html);
	},
	markField: function(m,v){
		var self = this;
		m = m*m;
		$('#field .header').html(v);
		$('#field table').addClass('visible');
		while($('#field td.mark').length < v){
			$('#field td').eq(Math.floor(Math.random()*m)).addClass('mark');
		}
		var tracker = '';
		for(var i = 0; i < v; i++){
			tracker += '<span class="track"></span>';
		}
		$('#field .footer').html(tracker);
		setTimeout(function(){
			$('#field table').removeClass('visible');
			self.isActive = true;
		},1000);
	},
	updTrack: function(c){
		$('#field .track').eq(this.clicksCount-1).addClass(c);
	},
	theEnd: function(){
		var self = this;
		this.isActive = false;
		if(this.errorCount === 0){
			this.toMark++;
			$('#field').addClass('removing-ok');
			$('#field .header').html('<span class="msg-good">Well done!</span>')
		} else {
			$('#field table').addClass('removing-fail');
			$('#field .mark:not(.on)').addClass('over');
			$('#field .header').html('<span class="msg-bad">Try again!</span>')
			if(this.errorCount > 1 && this.toMark > 3){
				this.toMark--;
			}
		}
		setTimeout(function(){
			self.newGame();
		}, 1500);
	},
	attachHandlers: function(){
		var self = this;
		$('#field td').on('click', function(){
			if($(this).hasClass('on') || $(this).hasClass('off') || !self.isActive){ return false; }

			self.clicksCount++;

			if($(this).hasClass('mark')){
				$(this).addClass('on');
				self.updTrack('on');
			} else {
				$(this).addClass('off');
				self.updTrack('off');
				self.errorCount++
			}
			if(self.clicksCount === self.toMark){
				self.theEnd();
			}
		});
		$('#field .doRestart').on('click', function(){
			if(self.toMark > 3){
				self.toMark--;
			}
			$('#field').addClass('removing-restart');
			setTimeout(function(){
				self.newGame();
			},500);
		});

	},
	newGame: function(){
		this.errorCount = 0;
		this.clicksCount = 0;
		var fieldSize = Math.round(Math.sqrt(this.toMark*3));
		this.drawField(fieldSize);
		this.markField(fieldSize, this.toMark);
		this.attachHandlers();
		$('#field').removeClass('removing-ok removing-fail removing-restart');
	},
	init: function(){
		var self = this;
		var btn = $('<button>Start</button>').on('click', function(){
			self.newGame();
		})
		$('#field').html(btn);
	}
}
$(function(){
	gSquares.init();
});
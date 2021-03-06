/**
 * @author
 * @github https://github.com/bh-lay/toucher
 * @modified 2016-5-25 23:27
 *
 */

 
(function(global,doc,factoryFn){

	var factory = factoryFn(global,doc);
	

	global.util = global.util || {};
	global.util.toucher = global.util.toucher || factory;
	

	global.define && define(function(require,exports,module){
		return factory;
	});
})(this,document,function(window,document){

	/**
	* class
	*/
	var supports_classList = !!document.createElement('div').classList,

		hasClass = supports_classList ? function( node, classSingle ){
			return node && node.classList && node.classList.contains( classSingle );
		} : function ( node, classSingle ){
			if( !node || typeof( node.className ) !== 'string'  ){
				return false;
			}
			return !! node.className.match(new RegExp('(\\s|^)' + classSingle + '(\\s|$)'));
		};
	var supportTouch = "ontouchend" in document ? true : false;
	/**
	 * @method
	 * @description
	 * @param string
	 * @param object
	 */
	function EMIT(eventName,e){
		this._events = this._events || {};

		if(!this._events[eventName]){
			return;
		}

		var rest_events = this._events[eventName];
		

		var target = e.target;
		while (1) {

			if(rest_events.length ==0){
				return;
			}

			if(target == this.dom || !target){

				for(var i=0,total=rest_events.length;i<total;i++){
					var classStr = rest_events[i]['className'];
					var callback = rest_events[i]['fn'];

					if(classStr == null){
						event_callback(eventName,callback,target,e);
					}
				}
				return;
			}
			

			var eventsList = rest_events;

			rest_events = [];


			for(var i=0,total=eventsList.length;i<total;i++){
				var classStr = eventsList[i]['className'];
				var callback = eventsList[i]['fn'];

				if(hasClass(target,classStr)){

					if(event_callback(eventName,callback,target,e) == false){
						return;
					}
				}else{

					rest_events.push(eventsList[i]);
				}
			}

			target = target.parentNode;
		}
	}
	
	/**
	 *
	 * @param[string]
	 * @param[function]
	 * @param[object]
	 * @param[object]
	 */
	function event_callback(name,fn,dom,e){

		var touches = e.plugTouches || e.touches,
			touch = touches.length ? touches[0] : {},
			newE = {
				type : name,
				target : e.target,
				pageX : touch.pageX,
				pageY : touch.pageY,
				clientX : touch.clientX || 0,
				clientY : touch.clientY || 0
			};

		if(name.match(/^swipe/) && e.plugStartPosition){
			newE.startX = e.plugStartPosition.pageX;
			newE.startY = e.plugStartPosition.pageY;
			newE.moveX = newE.pageX - newE.startX;
			newE.moveY = newE.pageY - newE.startY;
		}

		var call_result = fn.call(dom,newE);

		if(call_result == false){
			e.preventDefault();
			e.stopPropagation();
		}
		
		return call_result;
	}
	/**
	 *
	 */
	function swipeDirection(x1, x2, y1, y2) {
		return Math.abs(x1 - x2) >=	Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
	}

	/**
	 *
	 * 
	 */
	function eventListener(DOM){
		var this_touch = this;


		var touchStartTime = 0;
		

		var lastTouchTime = 0;
		

		var x1,y1,x2,y2;
		

		var touchDelay;
		

		var longTap;
		

		var isActive = false;

		var eventMark = null;

		function actionOver(e){
			isActive = false;
			clearTimeout(longTap);
			clearTimeout(touchDelay);
		}
		

		function isSingleTap(){
			actionOver();
			EMIT.call(this_touch,'singleTap',eventMark);
		}

		function touchStart(e){

			eventMark = e;
			x1 = e.touches[0].pageX;
			y1 = e.touches[0].pageY;
			x2 = 0;
			y2 = 0;
			isActive = true;
			touchStartTime = new Date();
			EMIT.call(this_touch,'swipeStart',e);

			clearTimeout(longTap);
			longTap = setTimeout(function(){
				actionOver(e);

				EMIT.call(this_touch,'longTap',e);
			},500);
		}

		function touchend(e){

			e.plugStartPosition = eventMark.plugStartPosition;
			e.plugTouches = eventMark.touches;
			
			EMIT.call(this_touch,'swipeEnd',e);
			if(!isActive){
				return;
			}
			var now = new Date();

			if(!this_touch._events.doubleTap || this_touch._events.doubleTap.length == 0){
				isSingleTap();
			}else if(now - lastTouchTime > 200){

				touchDelay = setTimeout(isSingleTap,190);
			}else{
				clearTimeout(touchDelay);
				actionOver(e);

				EMIT.call(this_touch,'doubleTap',eventMark);
			}
			lastTouchTime = now;
		}
		

		function touchmove(e){

			eventMark = e;

			e.plugStartPosition = {
				pageX : x1,
				pageY : y1
			};

			EMIT.call(this_touch,'swipe',e);

			if(!isActive){
				return;
			}
			x2 = e.touches[0].pageX;
			y2 = e.touches[0].pageY;
			if(Math.abs(x1-x2)>2 || Math.abs(y1-y2)>2){

				var direction = swipeDirection(x1, x2, y1, y2);
				EMIT.call(this_touch,'swipe' + direction,e);
			}else{

				isSingleTap();
			}
			actionOver(e);
		}
		if (supportTouch) {
			DOM.addEventListener('touchstart',touchStart);
			DOM.addEventListener('touchend',touchend);
			DOM.addEventListener('touchmove',touchmove);
			DOM.addEventListener('touchcancel',actionOver);
		} else {
			DOM.addEventListener('MSPointerDown',touchStart);
			DOM.addEventListener('pointerdown',touchStart);

			DOM.addEventListener('MSPointerUp',touchend);
			DOM.addEventListener('pointerup',touchend);

			DOM.addEventListener('MSPointerMove',touchmove);
			DOM.addEventListener('pointermove',touchmove);

			DOM.addEventListener('MSPointerCancel',actionOver);
			DOM.addEventListener('pointercancel',actionOver);
		}
	}
	
	/**
	 * touch
	 * 
	 */
	function Touch(DOM,param){
		var param = param || {};

		this.dom = DOM;

		this._events = {};

		eventListener.call(this,this.dom);
	}
	/**
	 * @method
	 * @description
	 * 
	 * @param string
	 * @param [string]
	 * @param function
	 * 
	 **/
	Touch.prototype.on = function ON(eventStr,a,b){
		var className,fn;
		if(typeof(a) == 'string'){
			className = a.replace(/^\./,'');
			fn = b;
		}else{
			className = null;
			fn = a;
		}

		if(typeof(fn) == 'function' && eventStr && eventStr.length){
			var eventNames = eventStr.split(/\s+/);
			for(var i=0,total=eventNames.length;i<total;i++){
			
				var eventName = eventNames[i];

				if(!this._events[eventName]){
					this._events[eventName] = [];
				}
				this._events[eventName].push({
					className : className,
					fn : fn
				});
			}
		}
		

		return this;
	};
	

	return function (dom){
		return new Touch(dom);
	};
});

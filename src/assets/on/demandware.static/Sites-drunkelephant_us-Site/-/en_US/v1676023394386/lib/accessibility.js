"use strict";var accessibility;if(typeof document!=='undefined'&&typeof window!=='undefined'&&typeof Element.prototype.contains!=='function'){Element.prototype.contains=function contains(el){return this.compareDocumentPosition(el)%16;};document.contains=function docContains(el){return document.body.contains(el);};}
var a11yGroup=function a11yGroup(el,options){var _this=this;var mousedown=false;var keyboardOnlyInstructionsId;var keyboardOnlyInstructionsEl;this.mod=function(n,m){return(n%m+m)%m;};this.init=function(el,options){var _ref=options||{},preventClickDefault=_ref.preventClickDefault,allowTabbing=_ref.allowTabbing,doKeyChecking=_ref.doKeyChecking,ariaCheckedCallback=_ref.ariaCheckedCallback,setState=_ref.setState,radioFocusCallback=_ref.radioFocusCallback,focusCallback=_ref.focusCallback,doSelectFirstOnInit=_ref.doSelectFirstOnInit,visuallyHiddenClass=_ref.visuallyHiddenClass,activatedEventName=_ref.activatedEventName,deactivatedEventName=_ref.deactivatedEventName;_this.allowTabbing=!!allowTabbing;_this.doKeyChecking=!!doKeyChecking;_this.preventClickDefault=!!preventClickDefault;_this.setState=setState===false?false:true;_this.role=el.getAttribute('role');_this.visuallyHiddenClass=visuallyHiddenClass||'sr-only';_this.activatedEventName=activatedEventName;_this.deactivatedEventName=deactivatedEventName;var groupRe=/(group$|list$|^listbox$)/;keyboardOnlyInstructionsId=el.dataset.keyboardOnlyInstructions;keyboardOnlyInstructionsEl=keyboardOnlyInstructionsId?document.getElementById(keyboardOnlyInstructionsId):null;if(_this.role===null||!groupRe.test(_this.role)){return;}else if(_this.role==="listbox"){_this.groupType='option';}else{_this.groupType=_this.role.replace(groupRe,'');}
_this.ariaCheckedCallback=ariaCheckedCallback;_this.focusCallback=focusCallback||radioFocusCallback;_this.checkedAttribute=_this.groupType==='tab'||_this.groupType==='option'?'aria-selected':'aria-checked';el.addEventListener('keydown',_this.onKeyUp.bind(_this),true);el.addEventListener('click',_this.onClick.bind(_this),true);if(doSelectFirstOnInit){_this.select(null,el.querySelector("[role=\"".concat(_this.groupType,"\"]")));}
if(keyboardOnlyInstructionsEl){el.addEventListener('mousedown',_this.mousedownEvent);el.addEventListener('focusout',_this.focusoutEvent);}
el.addEventListener('focusin',_this.focusinEvent);};this.mousedownEvent=function(){mousedown=true;};this.focusinEvent=function(e){var groupEls=e.currentTarget.querySelectorAll("[role=\"".concat(_this.groupType,"\"]"));if(keyboardOnlyInstructionsEl){if(!mousedown){keyboardOnlyInstructionsEl.classList.remove(_this.visuallyHiddenClass);}}
if(!mousedown&&!_this.allowTabbing&&_this.groupType!=='option'){for(var i=0;i<groupEls.length;i++){var _el=groupEls[i];if(_el.getAttribute(_this.checkedAttribute)==='true'){_el.focus();break;}}}
mousedown=false;};this.focusoutEvent=function(){keyboardOnlyInstructionsEl.classList.add(_this.visuallyHiddenClass);};this.select=function(e,memberEl,doNotRefocus){var ariaCheckedCallback=_this.ariaCheckedCallback,setState=_this.setState,checkedAttribute=_this.checkedAttribute,allowTabbing=_this.allowTabbing;var _group=memberEl.closest("[role=".concat(_this.role,"]"));var groupEls=Array.from(_group.querySelectorAll("[role=\"".concat(_this.groupType,"\"]")));var previouslyCheckedEl;var currentlyCheckedEl;var currentlyCheckedIndex;for(var i=0;i<groupEls.length;i++){var currentEl=groupEls[i];var checkedState='false';if(currentEl.getAttribute(checkedAttribute)==='true'){previouslyCheckedEl=currentEl;}
if(currentEl===memberEl){if(setState){checkedState='true';}
currentlyCheckedEl=currentEl;currentlyCheckedIndex=i;}
if(setState){currentEl.setAttribute(checkedAttribute,checkedState);currentEl.dispatchEvent(new CustomEvent(checkedState==='true'?_this.activatedEventName:_this.deactivatedEventName,{'bubbles':true,detail:{group:function group(){return _group;}}}));if(currentEl===memberEl){if(document.activeElement!==document.body){currentEl.focus();}}}
if(!allowTabbing){if(checkedState==='true'){currentEl.setAttribute('tabIndex','0');}else{currentEl.setAttribute('tabIndex','-1');}}}
if(allowTabbing&&!doNotRefocus){accessibility.refocusCurrentElement();}
if(ariaCheckedCallback){ariaCheckedCallback(e,currentlyCheckedEl,currentlyCheckedIndex,previouslyCheckedEl,groupEls);}};this.onClick=function(e){var target=e.target;if(_this.preventClickDefault){e.preventDefault();}
if(target.getAttribute('role')===_this.groupType){_this.select(e,target);target.focus();}};this.onFocus=function(e){var target=e.target,currentTarget=e.currentTarget;if(!currentTarget){return;}
var focusCallback=_this.focusCallback;var radioEls=Array.from(currentTarget.querySelectorAll("[role=\"".concat(_this.groupType,"\"]")));var targetIndex=radioEls.indexOf(target);if(focusCallback){focusCallback(e,target,targetIndex,currentTarget);}};this.onKeyUp=function(e){var key=e.key,target=e.target,currentTarget=e.currentTarget;var targetRole=target.getAttribute('role');var doKeyChecking=_this.doKeyChecking;if(targetRole===_this.groupType){var radioEls=Array.from(currentTarget.querySelectorAll("[role=\"".concat(_this.groupType,"\"]")));var targetIndex=radioEls.indexOf(target);var isOption=targetRole==='option';var elToFocus;if(targetIndex>=0){switch(key){case 'ArrowUp':case 'ArrowLeft':elToFocus=radioEls[_this.mod(targetIndex-1,radioEls.length)];if(!isOption){_this.select(e,elToFocus,true);}
break;case 'ArrowDown':case 'ArrowRight':elToFocus=radioEls[_this.mod(targetIndex+1,radioEls.length)];if(!isOption){_this.select(e,elToFocus,true);}
break;case ' ':case 'Enter':if(doKeyChecking){_this.select(e,target);e.preventDefault();}
break;default:}
if(elToFocus){e.preventDefault();requestAnimationFrame(function(){elToFocus.focus();if(key==='Tab'){requestAnimationFrame(function(){_this.onFocus(e);},{useRealRAF:true});}});}}}};this.init(el,options);};accessibility={tempFocusElement:null,tempFocusElementText:' select ',tabbableSelector:"a[href]:not([tabindex=\"-1\"]):not([disabled]),\n     area[href]:not([tabindex=\"-1\"]):not([disabled]),\n     details:not([tabindex=\"-1\"]):not([disabled]),\n     iframe:not([tabindex=\"-1\"]):not([disabled]),\n     keygen:not([tabindex=\"-1\"]):not([disabled]),\n     [contentEditable=true]:not([tabindex=\"-1\"]):not([disabled]),\n     :enabled:not(fieldset):not([tabindex=\"-1\"]):not([disabled]),\n     object:not([tabindex=\"-1\"]):not([disabled]),\n     embed:not([tabindex=\"-1\"]):not([disabled]),\n     [tabindex]:not([tabindex=\"-1\"]):not([disabled])",htmlTagRegex:/(<([^>]+)>)/gi,hasSecondaryNavSkipTarget:false,mainContentSelector:'',activeSubdocument:null,oldAriaHiddenVal:'data-old-aria-hidden',groups:[],focusAndScrollToView:function focusAndScrollToView(element){element.focus();var elementRect=element.getBoundingClientRect();var elementOnTop=document.elementFromPoint(elementRect.left,elementRect.top);if(elementOnTop&&elementOnTop!==element){var topElRect=elementOnTop.getBoundingClientRect();window.scrollBy(0,topElRect.top-topElRect.bottom);}},applyFormFocus:function applyFormFocus(formElement){var _this2=this;var options=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var firstValid=options.firstValid,isAjaxForm=options.isAjaxForm,e=options.e;var isFormInvalid=false;if(isAjaxForm){e.preventDefault();}
if(formElement instanceof window.HTMLElement){var formFields=formElement.elements;var _loop=function _loop(i){var formField=formFields[i];if(formField.nodeName!=='FIELDSET'&&(firstValid||formField.getAttribute('aria-invalid')==='true')){isFormInvalid=true;if(document.activeElement===formField){_this2.focusAndScrollToView(formFields[i+1]);setTimeout(function(){if(formField){_this2.focusAndScrollToView(formField);}},500);}else{_this2.focusAndScrollToView(formField);}
return "break";}};for(var i=0;i<formFields.length;i+=1){var _ret=_loop(i);if(_ret==="break")break;}
if(!isFormInvalid){requestAnimationFrame(function(){var globalError=formElement.querySelector('.form-error__error-text');if(globalError){_this2.focusAndScrollToView(globalError);}});}}
return isFormInvalid;},refocusCurrentElement:function refocusCurrentElement(callback){var _this3=this;var _document=document,activeElement=_document.activeElement;var isElementInModal=false;var modalParentElm=null;if(activeElement&&typeof Element.prototype.closest==='function'){modalParentElm=activeElement.closest('[role="dialog"], dialog');if(modalParentElm){isElementInModal=true;}}
if((!this.tempFocusElement||isElementInModal)&&document){var elm=document.createElement('div');elm.setAttribute('tabindex','-1');elm.className='sr-only';elm.style.cssText='position:fixed;top:0;left:0;';elm.setAttribute('aria-label',this.tempFocusElementText);elm.innerHTML=this.tempFocusElementText;if(isElementInModal&&modalParentElm){modalParentElm.appendChild(elm);}else{document.body.appendChild(elm);}
this.tempFocusElement=elm;}
if(this.tempFocusElement&&activeElement){var tempFocusElement=this.tempFocusElement;if(!activeElement.role){tempFocusElement.role='button';}else{tempFocusElement.role=activeElement.role;}
tempFocusElement.focus();setTimeout(function(){if(activeElement){activeElement.focus();_this3.tempFocusElement.role=null;if(isElementInModal){_this3.tempFocusElement=null;}
if(callback){callback();}}},500);}},doIfBlurred:function doIfBlurred(e,func){requestAnimationFrame(this.doIfBlurredHelper.bind(this,e.currentTarget,e.relatedTarget,func));},doIfBlurredHelper:function doIfBlurredHelper(currentTarget,relatedTarget,func){var focusedElement=relatedTarget||document.activeElement;var isFocusLost=focusedElement.parentNode===document.body||focusedElement===document.body||focusedElement===null;if(!isFocusLost&&!currentTarget.contains(focusedElement)){func();}},removeHTML:function removeHTML(html){return html.replace(this.htmlTagRegex,'');},toLowerCase:function toLowerCase(s){var r='';if(s){if(s.toString){r=this.removeHTML(s.toString().toLowerCase());}else if(s.toLowerCase){r=this.removeHTML(s.toLowerCase());}}
return r;},createKeyboardTrap:function createKeyboardTrap(){var trap=document.createElement("div");trap.classList.add("enable-tabtrap");trap.classList.add("sr-only");trap.setAttribute("tabindex","0");return trap;},removeKeyboardFocusLoop:function removeKeyboardFocusLoop(element){var _this4=this;document.querySelectorAll('.enable-tabtrap').forEach(function(el){if(el.classList.contains('enable-tabtrap__first')){el.removeEventListener("focus",_this4.focusLastElement);}else{el.removeEventListener("focus",_this4.focusFirstElement);}
el.parentElement.removeChild(el);});},setKeyboardFocusLoop:function setKeyboardFocusLoop(el){var firstTrap=this.createKeyboardTrap();var lastTrap=this.createKeyboardTrap();this.applyKeyboardTraps(el,firstTrap,lastTrap);},focusFirstElement:function focusFirstElement(e){var activeSubdocument=this.activeSubdocument,tabbableSelector=this.tabbableSelector;var tabbableEls=activeSubdocument.querySelectorAll(tabbableSelector);tabbableEls[1].focus();},focusLastElement:function focusLastElement(e){var activeSubdocument=this.activeSubdocument,tabbableSelector=this.tabbableSelector;var tabbableEls=activeSubdocument.querySelectorAll(tabbableSelector);tabbableEls[tabbableEls.length-2].focus();},applyKeyboardTraps:function applyKeyboardTraps(element,firstTrap,lastTrap){firstTrap.classList.add('enable-tabtrap__first');firstTrap.addEventListener("focus",this.focusLastElement.bind(this));lastTrap.classList.add('enable-tabtrap__last');lastTrap.addEventListener("focus",this.focusFirstElement.bind(this));element.insertBefore(firstTrap,element.firstChild);element.appendChild(lastTrap);},setMobileFocusLoop:function setMobileFocusLoop(el){var _document2=document,body=_document2.body;var currentEl=el;var hiddenEl=document.querySelector("[".concat(this.oldAriaHiddenVal,"]"));if(hiddenEl!==null){console.warn('Attempted to run setMobileFocusLoop() twice in a row.  removeMobileFocusLoop() must be executed before it run again. Bailing.');return;}
do{var siblings=currentEl.parentNode.childNodes;for(var i=0;i<siblings.length;i++){var sibling=siblings[i];if(sibling!==currentEl&&sibling.setAttribute){sibling.setAttribute(this.oldAriaHiddenVal,sibling.ariaHidden||'null');sibling.setAttribute('aria-hidden','true');sibling.classList.add('enable-aria-hidden');}}
currentEl=currentEl.parentNode;}while(currentEl!==body);requestAnimationFrame(this.fixChromeAriaHiddenBug);},fixChromeAriaHiddenBug:function fixChromeAriaHiddenBug(){var elsToReset=document.querySelectorAll('.enable-aria-hidden');for(var i=0;i<elsToReset.length;i++){elsToReset[i].classList.remove('enable-aria-hidden');}},removeMobileFocusLoop:function removeMobileFocusLoop(){var elsToReset=document.querySelectorAll("[".concat(this.oldAriaHiddenVal,"]"));for(var i=0;i<elsToReset.length;i++){var el=elsToReset[i];var ariaHiddenVal=el.getAttribute(this.oldAriaHiddenVal);if(ariaHiddenVal==='null'){el.removeAttribute('aria-hidden');}else{el.setAttribute('aria-hidden',ariaHiddenVal);}
el.removeAttribute(this.oldAriaHiddenVal);}},setKeepFocusInside:function setKeepFocusInside(el,doKeepFocusInside){var _document3=document,body=_document3.body;if(doKeepFocusInside){if(this.activeSubdocument){accessibility.setKeepFocusInside(this.activeSubdocument,false);}
this.activeSubdocument=el;this.setKeyboardFocusLoop(el);this.setMobileFocusLoop(el);}else{this.activeSubdocument=null;this.removeKeyboardFocusLoop(el);this.removeMobileFocusLoop(el);}},normalizedKey:function normalizedKey(key){switch(key){case "Space":case "SpaceBar":return " ";case "OS":return "Meta";case "Scroll":return "ScrollLock";case "Left":case "Right":case "Up":case "Down":return "Arrow"+key;case "Del":return "Delete";case "Crsel":return "CrSel";case "Essel":return "EsSel";case "Esc":return "Escape";case "Apps":return "ContextMenu";case "AltGraph":return "ModeChange";case "MediaNextTrack":return "MediaTrackNext";case "MediaPreviousTrack":return "MediaTrackPrevious";case "FastFwd":return "MediaFastForward";case "VolumeUp":case "VolumeDown":case "VolumeMute":return "Audio"+key;case "Decimal":return ".";case "Add":return "+";case "Subtract":return "-";case "Multiply":return "*";case "Divide":return "/";default:return key;}},getAriaControllerEl:function getAriaControllerEl($el){var $controller=document.querySelector('[aria-controls="'+$el.id+'"]');if(!$controller){throw "Error: There is no element that has aria-controls set to "+$el.id;}
return $controller;},getAriaControlsEl:function getAriaControlsEl($el){var $ariaControlsEl=document.getElementById($el.getAttribute('aria-controls'));if(!$ariaControlsEl){throw "Error: aria-controls on button must be set to id of flyout menu.";}
return $ariaControlsEl;},setDebugMode:function setDebugMode(){HTMLElement.prototype.oldFocus=HTMLElement.prototype.focus;HTMLElement.prototype.focus=function(){this.oldFocus();};},initGroup:function initGroup(el,options){this.groups.push(new a11yGroup(el,options));},setArrowKeyRadioGroupEvents:function setArrowKeyRadioGroupEvents(el,options){console.warn('Note: this method is deprecated.  Please use .initGroup instead.');this.initGroup(el,options);}};
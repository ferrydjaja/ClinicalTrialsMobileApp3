tinymce.PluginManager.add('contextmenu',function(a){var m,v,c=a.settings.contextmenu_never_use_native;var b=function(e){return e.ctrlKey&&!c;};var d=function(){return tinymce.Env.mac&&tinymce.Env.webkit;};var f=function(){return v===true;};a.on('mousedown',function(e){if(d()&&e.button===2&&!b(e)){if(a.selection.isCollapsed()){a.once('contextmenu',function(e){a.selection.placeCaretAt(e.clientX,e.clientY);});}}});a.on('contextmenu',function(e){var g;if(b(e)){return;}e.preventDefault();g=a.settings.contextmenu||'link openlink image inserttable | cell row column deletetable';if(!m){var h=[];tinymce.each(g.split(/[ ,]/),function(n){var j=a.menuItems[n];if(n=='|'){j={text:n};}if(j){j.shortcut='';h.push(j);}});for(var i=0;i<h.length;i++){if(h[i].text=='|'){if(i===0||i==h.length-1){h.splice(i,1);}}}m=new tinymce.ui.Menu({items:h,context:'contextmenu',classes:'contextmenu'}).renderTo();m.on('hide',function(e){if(e.control===this){v=false;}});a.on('remove',function(){m.remove();m=null;});}else{m.show();}var p={x:e.pageX,y:e.pageY};if(!a.inline){p=tinymce.DOM.getPos(a.getContentAreaContainer());p.x+=e.clientX;p.y+=e.clientY;}m.moveTo(p.x,p.y);v=true;});return{isContextMenuVisible:f};});
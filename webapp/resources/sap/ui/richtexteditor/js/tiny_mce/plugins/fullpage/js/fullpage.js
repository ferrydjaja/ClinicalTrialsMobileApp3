(function(){tinyMCEPopup.requireLangPack();var d='XHTML 1.0 Transitional=<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">,'+'XHTML 1.0 Frameset=<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">,'+'XHTML 1.0 Strict=<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">,'+'XHTML 1.1=<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">,'+'HTML 4.01 Transitional=<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">,'+'HTML 4.01 Strict=<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">,'+'HTML 4.01 Frameset=<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">';var a='Western european (iso-8859-1)=iso-8859-1,'+'Central European (iso-8859-2)=iso-8859-2,'+'Unicode (UTF-8)=utf-8,'+'Chinese traditional (Big5)=big5,'+'Cyrillic (iso-8859-5)=iso-8859-5,'+'Japanese (iso-2022-jp)=iso-2022-jp,'+'Greek (iso-8859-7)=iso-8859-7,'+'Korean (iso-2022-kr)=iso-2022-kr,'+'ASCII (us-ascii)=us-ascii';var b='Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,times new roman,times,serif;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times,serif;Verdana=verdana,arial,helvetica,sans-serif;Impact=impact,sans-serif;WingDings=wingdings';var c='10px,11px,12px,13px,14px,15px,16px';function s(i,v){var f=document.getElementById(i);if(f){v=v||'';if(f.nodeName=="SELECT"){selectByValue(document.forms[0],i,v);}else if(f.type=="checkbox"){f.checked=!!v;}else{f.value=v;}}}function g(i){var f=document.getElementById(i);if(f.nodeName=="SELECT"){return f.options[f.selectedIndex].value;}if(f.type=="checkbox"){return f.checked;}return f.value;}window.FullPageDialog={changedStyle:function(){var v,f=tinyMCEPopup.editor.dom.parseStyle(g('style'));s('fontface',f['font-face']);s('fontsize',f['font-size']);s('textcolor',f['color']);if(v=f['background-image']){s('bgimage',v.replace(new RegExp("url\\('?([^']*)'?\\)",'gi'),"$1"));}else{s('bgimage','');}s('bgcolor',f['background-color']);s('topmargin','');s('rightmargin','');s('bottommargin','');s('leftmargin','');if(v=f['margin']){v=v.split(' ');f['margin-top']=v[0]||'';f['margin-right']=v[1]||v[0]||'';f['margin-bottom']=v[2]||v[0]||'';f['margin-left']=v[3]||v[0]||'';}if(v=f['margin-top']){s('topmargin',v.replace(/px/,''));}if(v=f['margin-right']){s('rightmargin',v.replace(/px/,''));}if(v=f['margin-bottom']){s('bottommargin',v.replace(/px/,''));}if(v=f['margin-left']){s('leftmargin',v.replace(/px/,''));}updateColor('bgcolor_pick','bgcolor');updateColor('textcolor_pick','textcolor');},changedStyleProp:function(){var v,f=tinyMCEPopup.editor.dom,h=f.parseStyle(g('style'));h['font-face']=g('fontface');h['font-size']=g('fontsize');h['color']=g('textcolor');h['background-color']=g('bgcolor');if(v=g('bgimage'))h['background-image']="url('"+v+"')";else h['background-image']='';delete h['margin'];if(v=g('topmargin'))h['margin-top']=v+"px";else h['margin-top']='';if(v=g('rightmargin'))h['margin-right']=v+"px";else h['margin-right']='';if(v=g('bottommargin'))h['margin-bottom']=v+"px";else h['margin-bottom']='';if(v=g('leftmargin'))h['margin-left']=v+"px";else h['margin-left']='';s('style',f.serializeStyle(f.parseStyle(f.serializeStyle(h))));this.changedStyle();},update:function(){var f={};tinymce.each(tinyMCEPopup.dom.select('select,input,textarea'),function(n){f[n.id]=g(n.id);});tinyMCEPopup.editor.plugins.fullpage._dataToHtml(f);tinyMCEPopup.close();}};function e(){var f=document.forms[0],i,h,l,j=tinyMCEPopup.editor;l=j.getParam("fullpage_doctypes",d).split(',');for(i=0;i<l.length;i++){h=l[i].split('=');if(h.length>1)addSelectValue(f,'doctype',h[0],h[1]);}l=j.getParam("fullpage_fonts",b).split(';');for(i=0;i<l.length;i++){h=l[i].split('=');if(h.length>1)addSelectValue(f,'fontface',h[0],h[1]);}l=j.getParam("fullpage_fontsizes",c).split(',');for(i=0;i<l.length;i++)addSelectValue(f,'fontsize',l[i],l[i]);l=j.getParam("fullpage_encodings",a).split(',');for(i=0;i<l.length;i++){h=l[i].split('=');if(h.length>1)addSelectValue(f,'docencoding',h[0],h[1]);}document.getElementById('bgcolor_pickcontainer').innerHTML=getColorPickerHTML('bgcolor_pick','bgcolor');document.getElementById('link_color_pickcontainer').innerHTML=getColorPickerHTML('link_color_pick','link_color');document.getElementById('visited_color_pickcontainer').innerHTML=getColorPickerHTML('visited_color_pick','visited_color');document.getElementById('active_color_pickcontainer').innerHTML=getColorPickerHTML('active_color_pick','active_color');document.getElementById('textcolor_pickcontainer').innerHTML=getColorPickerHTML('textcolor_pick','textcolor');document.getElementById('stylesheet_browsercontainer').innerHTML=getBrowserHTML('stylesheetbrowser','stylesheet','file','fullpage');document.getElementById('bgimage_pickcontainer').innerHTML=getBrowserHTML('bgimage_browser','bgimage','image','fullpage');if(isVisible('stylesheetbrowser'))document.getElementById('stylesheet').style.width='220px';if(isVisible('link_href_browser'))document.getElementById('element_link_href').style.width='230px';if(isVisible('bgimage_browser'))document.getElementById('bgimage').style.width='210px';tinymce.each(tinyMCEPopup.getWindowArg('data'),function(v,k){s(k,v);});FullPageDialog.changedStyle();updateColor('textcolor_pick','textcolor');updateColor('bgcolor_pick','bgcolor');updateColor('visited_color_pick','visited_color');updateColor('active_color_pick','active_color');updateColor('link_color_pick','link_color');};tinyMCEPopup.onInit.add(e);})();

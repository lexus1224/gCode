function gCode(){this.body=document.getElementsByTagName("body")[0],this.canvas=document.getElementById("myCanvas"),this.context=this.canvas.getContext("2d"),this.info=document.getElementById("myInfo"),this.radioInput=document.getElementsByClassName("radio"),this.canvasWidth=.8*window.screen.width,this.canvasHeight=this.canvasWidth,this.spacing=this.canvasWidth/3,this.radius=.28*this.spacing}gCode.prototype.initial=function(t){t&&(this.status="set",this.allPointsXY=[],this.readyToSaveCode=[],this.hasConfirmed=!1,this.setCoordinate(),this.touchDetection(),this.radioDetection()),this.paintedPoints=[],this.paintedPointsXY=[],this.unpaintedPoints=[1,2,3,4,5,6,7,8,9],this.savedCode=JSON.parse(window.localStorage.getItem("gestureCode")),this.touchIsValid=!1,this.touchEvent="",this.touchPosition={},"verify"!=this.status||this.savedCode?"set"==this.status&&this.savedCode&&this.hasConfirmed?this.showInfo(9):"set"==this.status&&this.savedCode?(this.showInfo(8),this.status="changeVerify"):"changeVerify"==this.status&&this.hasConfirmed?(this.showInfo(9),this.status="set"):"changeVerify"==this.status?this.showInfo(8):"repeat"!=this.status&&this.showInfo(1):this.showInfo(10),this.setCanvas(),this.drawRound(this.allPointsXY)},gCode.prototype.setCanvas=function(){this.canvas.setAttribute("width",this.canvasWidth),this.canvas.setAttribute("height",this.canvasHeight)},gCode.prototype.setCoordinate=function(){for(var t=0,i=0,s=1;s<=3;s++){t=0,i+=1==s?this.spacing/2:this.spacing;for(var e=1;e<=3;e++){t+=1==e?this.spacing/2:this.spacing;var n={X:t,Y:i,index:e+3*(s-1)};this.allPointsXY.push(n)}}},gCode.prototype.showInfo=function(t){switch(t){case 0:this.info.innerHTML="正在输入...";break;case 1:this.info.innerHTML="请输入手势密码";break;case 2:this.info.innerHTML="请再次输入手势密码";break;case 3:this.info.innerHTML="密码太短，至少需要5个点";break;case 4:this.info.innerHTML="密码设置成功";break;case 5:this.info.innerHTML="两次输入的不一致";break;case 6:this.info.innerHTML="密码正确！";break;case 7:this.info.innerHTML="输入的密码不正确";break;case 8:this.info.innerHTML="请输入已保存的手势密码";break;case 9:this.info.innerHTML="请输入新的手势密码";break;case 10:this.info.innerHTML="密码为空，请先设置密码"}},gCode.prototype.drawRound=function(t){t==this.allPointsXY?(this.context.strokeStyle="#ccc",this.context.fillStyle="#fff"):(this.context.strokeStyle="#d39741",this.context.fillStyle="#ffa722");for(var i=0;i<t.length;i++)this.context.lineWidth=2,this.context.beginPath(),this.context.arc(t[i].X,t[i].Y,this.radius+2,0,2*Math.PI,!0),this.context.closePath(),this.context.stroke(),this.context.fill()},gCode.prototype.drawLine=function(t){this.context.strokeStyle="#b34242",this.context.lineWidth=1.5,this.context.beginPath(),this.context.moveTo(this.paintedPointsXY[0].X,this.paintedPointsXY[0].Y);for(var i=1;i<this.paintedPointsXY.length;i++)this.context.lineTo(this.paintedPointsXY[i].X,this.paintedPointsXY[i].Y);t||this.context.lineTo(this.touchPosition.X,this.touchPosition.Y),this.context.stroke(),this.context.closePath()},gCode.prototype.touchDetection=function(){var t=this;this.body.addEventListener("touchmove",function(t){t.preventDefault()},!1),this.canvas.addEventListener("touchstart",function(i){t.touchEvent="start",t.checkPosition(i)},!1),this.canvas.addEventListener("touchmove",function(i){t.touchIsValid&&(t.showInfo(0),t.touchEvent="move",t.checkPosition(i))},!1),this.canvas.addEventListener("touchend",function(){if(t.touchIsValid){switch(t.status){case"set":t.setCode();break;case"repeat":t.repeatCode();break;case"changeVerify":t.hasConfirmed=t.verifyCode();break;case"verify":t.verifyCode()}t.setCanvas(),t.drawRound(t.allPointsXY),t.drawRound(t.paintedPointsXY),t.drawLine(!0),setTimeout(function(){t.initial(!1)},1e3)}},!1)},gCode.prototype.radioDetection=function(){var t=this;this.radioInput[0].addEventListener("click",function(){t.status="set",t.initial(!1)},!1),this.radioInput[1].addEventListener("click",function(){t.status="verify",t.initial(!1)},!1)},gCode.prototype.checkPosition=function(t){var i=t.touches[0],s=t.currentTarget.getBoundingClientRect();this.touchPosition={X:Number(i.pageX)-s.left,Y:Number(i.pageY)-s.top};for(var e=0;e<this.allPointsXY.length;e++)if(Math.abs(this.touchPosition.X-this.allPointsXY[e].X)<=this.radius&&Math.abs(this.touchPosition.Y-this.allPointsXY[e].Y)<=this.radius)if("start"==this.touchEvent)this.touchIsValid=!0;else if("move"==this.touchEvent&&1==this.touchIsValid&&this.unpaintedPoints.indexOf(this.allPointsXY[e].index)>=0){this.paintedPoints.push(this.allPointsXY[e].index);var n={X:this.allPointsXY[e].X,Y:this.allPointsXY[e].Y};this.paintedPointsXY.push(n),this.unpaintedPoints.splice(this.unpaintedPoints.indexOf(this.allPointsXY[e].index),1)}"move"==this.touchEvent&&1==this.touchIsValid&&(this.setCanvas(),this.drawRound(this.allPointsXY),this.drawRound(this.paintedPointsXY),this.drawLine(!1))},gCode.prototype.setCode=function(){this.paintedPoints.length>4?(this.readyToSaveCode=this.paintedPoints,this.status="repeat",this.showInfo(2)):this.showInfo(3)},gCode.prototype.repeatCode=function(){var t=!0;if(this.paintedPoints.length!=this.readyToSaveCode.length)this.showInfo(5),t=!1;else{for(var i=0;i<this.paintedPoints.length;i++)if(this.paintedPoints[i]!=this.readyToSaveCode[i]){t=!1;break}1==t?(window.localStorage.setItem("gestureCode",JSON.stringify(this.readyToSaveCode)),this.showInfo(4)):this.showInfo(5)}1==t&&this.savedCode?(this.status="changeVerify",this.hasConfirmed=!1):this.status="set"},gCode.prototype.verifyCode=function(){var t=!0;if(this.paintedPoints.length!=this.savedCode.length)this.showInfo(7),t=!1;else{for(var i=0;i<this.paintedPoints.length;i++)if(this.paintedPoints[i]!=this.savedCode[i]){t=!1;break}1==t?this.showInfo(6):this.showInfo(7)}return t};var newCode=new gCode;newCode.initial(!0);
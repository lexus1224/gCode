/**
 * Created by Lexus on 2017/3/23.
 */
function gCode() {
    this.canvas = document.getElementById('myCanvas');
    this.context = this.canvas.getContext('2d');
    this.info = document.getElementById('myInfo');
    this.radioInput = document.getElementsByClassName('radio');
    this.canvasWidth = window.screen.width * 0.8;
    this.canvasHeight = this.canvasWidth;
    this.spacing = this.canvasWidth / 4;
    this.radius = this.spacing * 0.3;

    this.status = 'set';
    this.allPoints = [];
    this.paintedPoints = [];
    this.unpaintedPoints = [];
    this.paintedPointsXY = [];
    this.readyToSaveCode = [];
    this.savedCode = [];
    this.touchIsValid = false;
    this.touchEvent = '';
    this.touchPosition = {};

    this.setCanvas();
    this.setRound('init');
    this.showInfo(1);
    this.touchDetection();
    this.radioDetection();
}

gCode.prototype.setCanvas = function () {
    this.canvas.setAttribute('width', this.canvasWidth);
    this.canvas.setAttribute('height', this.canvasHeight);
}

gCode.prototype.setRound = function (parameter) {
    for (var i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
            var point = {
                X: j * this.spacing,
                Y: i * this.spacing,
                index: j + (i - 1) * 3
            }
            this.drawRound(point.X, point.Y);
            if (parameter) {
                this.allPoints.push(point);
                this.unpaintedPoints.push(point.index);
            }
        }
    }
}

gCode.prototype.showInfo = function (type) {
    switch (type) {
        case 0:
            this.info.innerHTML = "正在输入...";
            break;
        case 1:
            this.info.innerHTML = "请输入手势密码";
            break;
        case 2:
            this.info.innerHTML = "请再次输入手势密码";
            break;
        case 3:
            this.info.innerHTML = "密码太短，至少需要5个点";
            break;
        case 4:
            this.info.innerHTML = "密码设置成功";
            break;
        case 5:
            this.info.innerHTML = "两次输入的不一致";
            break;
        case 6:
            this.info.innerHTML = "密码正确！";
            break;
        case 7:
            this.info.innerHTML = "输入的密码不正确";
            break;
    }
}

gCode.prototype.touchDetection = function () {
    var self = this;
    this.canvas.addEventListener('touchstart', function (evt) {
        //e.preventDefault();// 某些android 的 touchmove不宜触发 所以增加此行代码
        self.touchEvent = 'start';
        self.checkPosition(evt);
    }, false);
    this.canvas.addEventListener('touchmove', function (evt) {
        if (self.touchIsValid) {
            self.showInfo(0);
            self.touchEvent = 'move';
            self.checkPosition(evt);
        }
        evt.preventDefault();
    }, false);
    this.canvas.addEventListener('touchend', function () {
        if (self.touchIsValid) {
            switch (self.status) {
                case 'set':
                    self.setCode();
                    break;
                case 'repeat':
                    self.repeatCode();
                    break;
                case 'validate':
                    self.validateCode();
                    break;
            }
            setTimeout(function () {
                self.refresh();
                self.showInfo(1);
            }, 1000);
        }
    }, false);
}

gCode.prototype.radioDetection = function () {
    var self = this;
    this.radioInput[0].addEventListener('click', function () {
        self.status = 'set';
        self.refresh();
    }, false);
    this.radioInput[1].addEventListener('click', function () {
        self.status = 'validate';
        self.refresh();
    }, false);
}

gCode.prototype.checkPosition = function (evt) {
    var touch = evt.touches[0];
    var canvasSize = evt.currentTarget.getBoundingClientRect();
    this.touchPosition = {
        touchX: Number(touch.pageX) - canvasSize.left,
        touchY: Number(touch.pageY) - canvasSize.top
    };
    for (var i = 0; i < this.allPoints.length; i++) {
        if ((Math.abs(this.touchPosition.touchX - this.allPoints[i].X) <= this.radius) && (Math.abs(this.touchPosition.touchY - this.allPoints[i].Y) <= this.radius)) {
            if (this.touchEvent == 'start') {
                this.touchIsValid = true;
            }
            else if (this.touchEvent == 'move' && this.touchIsValid == true) {
                if (this.unpaintedPoints.indexOf(this.allPoints[i].index) >= 0) {
                    this.paintedPoints.push(this.allPoints[i].index);
                    var paintedXY = {
                        paintedX: this.allPoints[i].X,
                        paintedY: this.allPoints[i].Y
                    };
                    this.paintedPointsXY.push(paintedXY);
                    this.unpaintedPoints.splice(this.unpaintedPoints.indexOf(this.allPoints[i].index), 1);
                }
            }
        }
    }
    if (this.touchEvent == 'move' && this.touchIsValid == true) {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.setRound();
        this.fillRound();
        this.drawLine();
    }
}

gCode.prototype.drawRound = function (x, y) {
    this.context.strokeStyle = '#ccc';
    this.context.fillStyle = '#fff';
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.arc(x, y, this.radius + 1, 0, Math.PI * 2, true);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();
}

gCode.prototype.drawLine = function () {
    this.context.strokeStyle = '#b34242';
    this.context.lineWidth = 1.5;
    this.context.beginPath();
    this.context.moveTo(this.paintedPointsXY[0].paintedX, this.paintedPointsXY[0].paintedY);//将画笔移到x0,y0处
    for (var i = 1; i < this.paintedPoints.length; i++) {
        this.context.lineTo(this.paintedPointsXY[i].paintedX, this.paintedPointsXY[i].paintedY);//从x0,y0到x1,y1画一条线
    }
    this.context.lineTo(this.touchPosition.touchX, this.touchPosition.touchY);//从x0,y0到x1,y1画一条线
    this.context.stroke();//画线!!!
    this.context.closePath();
}

gCode.prototype.fillRound = function () {
    for (var i = 0; i < this.paintedPoints.length; i++) {
        this.context.fillStyle = '#fca71c';
        this.context.beginPath();
        this.context.arc(this.paintedPointsXY[i].paintedX, this.paintedPointsXY[i].paintedY, this.radius + 2, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fill();
    }
}

gCode.prototype.setCode = function () {
    if (this.paintedPoints.length > 4) {
        this.readyToSaveCode = this.paintedPoints;
        this.showInfo(2);
        this.status = 'repeat';
    }
    else {
        this.showInfo(3);
    }
}

gCode.prototype.repeatCode = function () {
    var flag = true;
    if (this.paintedPoints.length != this.readyToSaveCode.length) {
        this.showInfo(5);
        this.status = 'set';
    }
    else {
        for (var i = 0; i < this.paintedPoints.length; i++) {
            if (this.paintedPoints[i] != this.readyToSaveCode[i]) {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            console.log("aaa");
            window.localStorage.setItem('gestureCode', JSON.stringify(this.readyToSaveCode));//
            this.showInfo(4);
        }
        else {
            this.showInfo(5);
            this.status = 'set';
        }
    }
}

gCode.prototype.validateCode = function () {
    var flag = true;
    this.savedCode = JSON.parse(window.localStorage.getItem('gestureCode'));//
    console.log(this.savedCode);
    console.log(this.paintedPoints);
    if (this.paintedPoints.length != this.savedCode.length) {
        this.showInfo(7);
    }
    else {
        for (var i = 0; i < this.paintedPoints.length; i++) {
            if (this.paintedPoints[i] != this.savedCode[i]) {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            this.showInfo(6);
        }
        else {
            this.showInfo(7);
        }
    }
}

gCode.prototype.refresh = function () {
    this.allPoints = [];
    this.paintedPoints = [];
    this.unpaintedPoints = [];
    this.paintedPointsXY = [];
    this.touchIsValid = false;
    this.touchEvent = '';
    this.touchPosition = {};
    // this.status = window.localStorage.getItem('statusCode');
    this.setCanvas();
    this.setRound('again');
}

var newCode = new gCode();


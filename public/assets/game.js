const { Application, Graphics } = PIXI;

const app = new PIXI.Application();
const socket = io();
const player = new Graphics()

function click(e) {
    player.x = e.page.x - 10;
    player.y = e.page.y - 10;
    
}

async function start() {
    await app.init({ background: "0x36f4a2", resizeTo: window });
    document.body.appendChild(app.canvas);

    
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.addEventListener('click', click);
    app.stage.addChild(player);
}


player.rect(0, 0, 20, 20)
player.fill(0xffc107)


start();
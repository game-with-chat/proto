const { Application, Graphics } = PIXI;

const app = new PIXI.Application();
const socket = io();
const players = {};
let me;




function createPlayer({id,pos=[0,0]}) {
	console.log("new player")
	const graphics = new Graphics()

	function move([x,y]) {
		graphics.x = x - 10;
		graphics.y = y - 10;
	}
	graphics.rect(0, 0, 20, 20)
	graphics.fill(0xffc107)

    app.stage.addChild(graphics);
	move(pos)

	return {id,move,leave,graphics}
}

function click(e) {
    const pos = [e.page.x,e.page.y];
    socket.emit("move",pos)
}
async function start() {
    await app.init({ background: "0x36f4a2", resizeTo: window });
    document.body.appendChild(app.canvas);


    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.addEventListener('click', click);
}

function move(p) {
	console.log("[socket:move]",p)
	players[p.id]?.move(p.pos)
}

function room(room) {
	console.log("[socket:room]",room)
	room.forEach(p=> {
		players[p.id] = createPlayer(p)
	});	
}

function join(p) {
	console.log("[socket:join]",p)
	players[p.id] = createPlayer(p)
	
}
function leave(id) {
	console.log("[socket:leave]",id)
	app.stage.removeChild(players[id].graphics);
	delete players[id]
	
}

start();

socket.on("connect",()=>{
	me = socket.id
})

socket.on("move",move)
socket.on("join",join)
socket.on("leave",leave)
socket.on("room",room)
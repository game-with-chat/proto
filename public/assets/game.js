const { Application, Graphics,Container,Text } = PIXI;

const app = new PIXI.Application();
const socket = io();
const players = {};
const chatForm = document.getElementById("send-message");


function createPlayer(player) {
	console.debug("new player",player)

	function move([x=app.canvas.width/2,y=app.canvas.height/2]=[]) {
		container.x = x;
		container.y = y;
	}

	function chat(message) {
		chatMessage.text = message;
	}

	const container = new Container();
	const graphics = new Graphics()
	const username = new Text({ text: player.username,style: {
		fontFamily: 'Arial',
		fontSize: 15,
		align: 'center',
	} });

	graphics.rect(-20,-45, 40, 40)
	graphics.fill(0xffc107)
	username.x = 0;
	username.y = 0;
	username.anchor.set(0.5,0);


	const chatContainer = new Container();
	const chatMessage = new Text({ style: {
		fontFamily: 'Arial',
		fontSize: 15,
		align: 'center',
	} });
	const speechBubble = new Graphics()
	chatMessage.anchor.set(0.5,1);
	chatContainer.addChild(chatMessage)
	chatContainer.addChild(speechBubble);
	chatContainer.x =0;
	chatContainer.y =-70;


	container.addChild(graphics)
	container.addChild(username)
	container.addChild(chatContainer);
    app.stage.addChild(container);

	move(player.pos)
	return {id:player.id,move,container,chat,chatMessage}
}

function click(e) {
    const pos = [e.page.x,e.page.y];
    socket.emit("move",pos)
}
function auth() {
	let username = localStorage.getItem("username");
	if(!username) {
		username = prompt("Enter a username")
		localStorage.setItem("username",username)
	} 
	socket.emit("auth",username)
}

async function start() {
    await app.init({ background: "0x36f4a2", resizeTo: window });
    document.body.appendChild(app.canvas);


    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;

    app.stage.addEventListener('click', click);
    auth();
}
socket.on("connect",()=>{
	console.debug("[socket:connect]",socket.id)
	me = socket.id
})

socket.on("move",p => {
	console.debug("[socket:move]",p)
	players[p.id]?.move(p.pos)
})
socket.on("join",p=> {
	console.debug("[socket:join]",p)
	players[p.id] = createPlayer(p)
	
})
socket.on("leave",id=> {
	console.debug("[socket:leave]",id)
	app.stage.removeChild(players[id].container);
	delete players[id]
	
})
socket.on("room",room=>{
	console.debug("[socket:room]",room)
	room.forEach(p=> {
		players[p.id] = createPlayer(p)
	});	
})
socket.on("auth",()=> {
	console.debug("[socket:auth]")
	auth();
})

socket.on("welcome",()=>{
	console.debug("[socket:welcome]")
	socket.emit("join","face");
})

socket.on("chat",chat=>{
	console.debug("[socket:chat]",chat)
	players[chat.id].chat(chat.message);
})

chatForm.addEventListener("submit",e=>{
	e.preventDefault();
	//console.log()
	socket.emit("chat",new FormData(chatForm).get("message"))
})



start();

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

let truck;
let followCamera;
let insideCamera;
let activeCamera;

let gas = false;
let brake = false;
let left = false;
let right = false;

const createScene = () => {

    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0.53,0.81,0.98,1);

    new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0,1,0),
        scene
    );

    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        {
            width:500,
            height:500
        },
        scene
    );

    const groundMat = new BABYLON.StandardMaterial("ground",scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.2,0.7,0.2);
    ground.material = groundMat;

    followCamera = new BABYLON.FollowCamera(
        "follow",
        new BABYLON.Vector3(0,8,-18),
        scene
    );

    followCamera.radius = 18;
    followCamera.heightOffset = 6;
    followCamera.rotationOffset = 180;
    followCamera.cameraAcceleration = 0.05;
    followCamera.maxCameraSpeed = 20;

    insideCamera = new BABYLON.UniversalCamera(
        "inside",
        new BABYLON.Vector3(0,2,0),
        scene
    );

    activeCamera = followCamera;
    scene.activeCamera = activeCamera;
    activeCamera.attachControl(canvas,true);

    BABYLON.SceneLoader.ImportMesh(
        "",
        "./",
        "volvo_fh16_truck_lowpoly.glb",
        scene,
        function(meshes){

            truck = meshes[0];

            truck.position = new BABYLON.Vector3(0,0,0);
            truck.scaling = new BABYLON.Vector3(1,1,1);

            followCamera.lockedTarget = truck;
                        let speed = 0;

            const gasBtn = document.getElementById("gas");
            const brakeBtn = document.getElementById("brake");
            const leftBtn = document.getElementById("left");
            const rightBtn = document.getElementById("right");
            const cameraBtn = document.getElementById("camera");

            gasBtn.addEventListener("touchstart", () => gas = true);
            gasBtn.addEventListener("touchend", () => gas = false);

            brakeBtn.addEventListener("touchstart", () => brake = true);
            brakeBtn.addEventListener("touchend", () => brake = false);

            leftBtn.addEventListener("touchstart", () => left = true);
            leftBtn.addEventListener("touchend", () => left = false);

            rightBtn.addEventListener("touchstart", () => right = true);
            rightBtn.addEventListener("touchend", () => right = false);

            let inside = false;

            cameraBtn.onclick = () => {

                inside = !inside;

                if(inside){

                    scene.activeCamera = insideCamera;
                    insideCamera.position = truck.position.add(new BABYLON.Vector3(0,2.3,0));
                    insideCamera.rotation = truck.rotation.clone();

                }else{

                    scene.activeCamera = followCamera;

                }

                scene.activeCamera.attachControl(canvas,true);

            };

            scene.onBeforeRenderObservable.add(()=>{

                if(gas) speed += 0.003;
                if(brake) speed -= 0.005;

                speed *= 0.99;

                if(speed > 0.6) speed = 0.6;
                if(speed < -0.2) speed = -0.2;

                if(left) truck.rotation.y -= 0.03;
                if(right) truck.rotation.y += 0.03;

                truck.position.x += Math.sin(truck.rotation.y) * speed;
                truck.position.z += Math.cos(truck.rotation.y) * speed;

                if(inside){

                    insideCamera.position = truck.position.add(new BABYLON.Vector3(0,2.3,0));
                    insideCamera.rotation = truck.rotation.clone();

                }

            });

        }
    );

    return scene;

};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});

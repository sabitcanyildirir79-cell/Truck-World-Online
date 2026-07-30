const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    scene.clearColor = new BABYLON.Color4(0.53, 0.81, 0.98, 1);

    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 3,
        30,
        new BABYLON.Vector3(0, 0, 0),
        scene
    );

    camera.attachControl(canvas, true);

    new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        {
            width: 100,
            height: 100
        },
        scene
    );

    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.7, 0.2);
    ground.material = groundMat;

    BABYLON.SceneLoader.ImportMesh(
        "",
        "./",
        "volvo_fh16_truck_lowpoly.glb",
        scene,
        function (meshes) {

            const truck = meshes[0];

            truck.position = new BABYLON.Vector3(0, 0, 0);
            truck.scaling = new BABYLON.Vector3(1, 1, 1);

            let speed = 0;
            const keys = {};

            window.addEventListener("keydown", (e) => {
                keys[e.key.toLowerCase()] = true;
            });

            window.addEventListener("keyup", (e) => {
                keys[e.key.toLowerCase()] = false;
            });

            scene.onBeforeRenderObservable.add(() => {

                if (keys["w"]) speed = 0.12;
                else if (keys["s"]) speed = -0.08;
                else speed = 0;

                if (keys["a"]) truck.rotation.y -= 0.03;
                if (keys["d"]) truck.rotation.y += 0.03;

                truck.position.x += Math.sin(truck.rotation.y) * speed;
                truck.position.z += Math.cos(truck.rotation.y) * speed;

                camera.target.copyFrom(truck.position);

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
});,

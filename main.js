BABYLON.SceneLoader.ImportMesh(
    "",
    "./",
    "volvo_fh16_truck_lowpoly.glb",
    scene,
    function (meshes) {
        const truck = meshes[0];
        truck.position = new BABYLON.Vector3(0, 0, 0);
        truck.scaling = new BABYLON.Vector3(1, 1, 1);
    }
);

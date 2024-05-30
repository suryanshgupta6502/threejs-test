import * as three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { DRACOLoader} from 'three/examples/jsm/libs/draco/'

const canvas = document.querySelector(".webgl")

const scene = new three.Scene()
const sizes = {
    width: window.innerWidth,
    heigth: window.innerHeight
}

const camera = new three.PerspectiveCamera(75, sizes.width / sizes.heigth)
scene.add(camera)
camera.position.x = 10
camera.position.y = 10
camera.position.z = 15


window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.heigth = window.innerHeight

    camera.aspect = sizes.width / sizes.heigth
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.heigth)
})

const orbitcontrol = new OrbitControls(camera, canvas)
// scene.add(orbitcontrol)
const texureloader = new three.TextureLoader()
const displace = texureloader.load("./floor/laminate_floor_02_disp_1k.png")
const ao = texureloader.load("./floor/laminate_floor_02_ao_1k.png")
const roughness = texureloader.load("./floor/laminate_floor_02_rough_1k.png")
const normal = texureloader.load("./floor/laminate_floor_02_nor_dx_1k.png")
const map = texureloader.load("./floor/laminate_floor_02_diff_1k.png")

map.repeat.set(8,8)
roughness.repeat.set(8,8)
ao.repeat.set(8,8)
displace.repeat.set(8,8)
normal.repeat.set(8,8)

map.wrapS=three.RepeatWrapping
roughness.wrapS=three.RepeatWrapping
ao.wrapS=three.RepeatWrapping
displace.wrapS=three.RepeatWrapping
normal.wrapS=three.RepeatWrapping

map.wrapT=three.RepeatWrapping
ao.wrapT=three.RepeatWrapping
roughness.wrapT=three.RepeatWrapping
displace.wrapT=three.RepeatWrapping
normal.wrapT=three.RepeatWrapping


console.log(map);
// map.wrapS

const top = new three.Mesh(new three.BoxGeometry(31.6, .1, 31.6), new three.MeshBasicMaterial({ color: "#ff0000", side: three.DoubleSide }))
top.position.y = 3
const bottom = new three.Mesh(new three.BoxGeometry(31.6, .1, 31.6), new three.MeshStandardMaterial({
    // color: "#ff0000",
    side: three.DoubleSide,
    displacementScale:0,
    displacementMap: displace,
    aoMap: ao,
    roughnessMap: roughness,
    normalMap: normal,
    map:map
}))
bottom.position.y = 0
scene.add(bottom)

const dracoloader = new DRACOLoader()
const modeloader = new GLTFLoader()
dracoloader.setDecoderPath("draco/")
modeloader.setDRACOLoader(dracoloader)

modeloader.load("./model (1).gltf", (gltf) => {
    const model = gltf.scene.children[0]
    const geomerty = gltf.scene.children[0].geometry
    const material = gltf.scene.children[0].material
    // model.scale.set(.1, .1, .1)
    // model.position.y = -1
    // const instances = new three.InstancedMesh(geomerty, material, 10)
    // console.log(gltf.scene.children);

    for (let i = 0; i <= 10; i++) {
        const newmodel = new three.Mesh(geomerty, material)
        newmodel.position.x = ((Math.random() * 2 - 1) * 15)
        newmodel.position.z = ((Math.random() * 2 - 1) * 15)
        newmodel.rotation.y = Math.PI * Math.random()
        scene.add(newmodel)
        console.log(newmodel.position.x);
    }

    // console.log(instances);
})

const ambient=new three.AmbientLight("white",1)
scene.add(ambient)

const light = new three.DirectionalLight("white", 1)
scene.add(light)


const renderer = new three.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.heigth)

function tick() {

    renderer.render(scene, camera)

    // box.rotation.y += .1
    window.requestAnimationFrame(tick)
}

tick()

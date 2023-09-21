import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null
        this.boxMesh = null
        this.boxMesh1 = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        /*
        // box related attributes

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess , wireframe: true })

        // circle related attributes
        this.diffuseCircleColor = "#00ffff"
        this.specularCircleColor = "#777777"
        this.circleShininess = 30
        this.circleMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })
            */
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })
        
        
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxDisplacement = new THREE.Vector3(0,2,0);
        this.boxMesh.position.y = this.boxDisplacement.y;
        
    }

    buildBoxGeneric(color, specular, emissive, shininess, meshSize, x , y, z){
        const material = this.buildBoxMaterial(color ,specular, emissive, shininess);
        const box =  this.buildBoxGeometry(meshSize);
        const displacement = this.buildBoxDisplacement(x, y, z);
        const mesh =  this.buildBoxMesh(box, material, displacement);

        return {material, box, displacement, mesh};
    }

    buildBoxMaterial(color, specular, emissive, shininess){
       const material = new THREE.MeshPhongMaterial( {color, specular, emissive, shininess});
       return material;
    }

    buildBoxGeometry(meshSize){
        const box = new THREE.BoxGeometry(meshSize, meshSize, meshSize);
        return box;
    }

    buildBoxDisplacement(x, y , z){
        const displacement = new THREE.Vector3(x, y, z);
        return displacement;
    }

    buildBoxMesh(box , boxMaterial, displacement){
        const mesh = new THREE.Mesh(box, boxMaterial);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.x = displacement.x;
        mesh.position.y = displacement.y;
        mesh.position.z = displacement.z;
        return mesh;
    }
    /*



    buildPlane() {

        let plane1 = new THREE.PlaneGeometry( 15, 15 );
        this.planeMesh1 = new THREE.Mesh( plane1, this.planeMaterial );
        this.planeMesh1.rotation.x = -Math.PI / 2;
        this.planeMesh1.position.y = -5;
        this.app.scene.add( this.planeMesh1 );

    }

    buildCircle() {

        let circle = new THREE.CircleGeometry(4);
        this.circleMesh = new THREE.Mesh( circle, this.circleMaterial );
        this.app.scene.add(this.circleMesh);
    }
    */

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        // Create a Cube Mesh with basic material


        this.buildBox();

        const box1 = this.buildBoxGeneric("#ffff77", 
        "#000000", "#000000", 90, 1, 0 , 0 , 0);

        this.boxMesh1 = box1.mesh;

        /*
        
        // Create a Plane Mesh with basic material
        
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );

        this.buildPlane();

        this.buildCircle();

        //this.buildBox(7);
        */

    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
                this.app.scene.add(this.boxMesh1)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };
// custom component to handle opening and closing doors
@Component('doorState')
export class DoorState {
  closed: boolean = true
  openPos: Quaternion = Quaternion.Euler(0, 90, 0)
  closedPos: Quaternion = Quaternion.Euler(0, 0, 0)
  fraction: number = 0
}

// a group to keep track of all entities with a DoorState component
const doors = engine.getComponentGroup(DoorState)

// a system to carry out the rotation
export class RotatorSystem implements ISystem {
 
  update(dt: number) {
    // iterate over the doors in the component group
    for (let door of doors.entities) {
      
      // get some handy shortcuts
      let state = door.get(DoorState)
      let transform = door.get(Transform)
      
      // check if the rotation needs to be adjusted
      if (state.closed == false && state.fraction < 1) {
        state.fraction += dt
        let rot = Quaternion.Slerp(state.closedPos, state.openPos, state.fraction)
        transform.rotation = rot
      } else if (state.closed == true && state.fraction > 0) {
        state.fraction -= dt
        let rot = Quaternion.Slerp(state.closedPos, state.openPos, state.fraction)
        transform.rotation = rot
      }
    }
  }
}

// Add system to engine
engine.addSystem(new RotatorSystem())

// Define fixed walls
const wall1 = new Entity()
wall1.set(new Transform({
  position: new Vector3(5.75, 1, 3),
  scale: new Vector3(1.5, 2, 0.05)
}))
wall1.set(new BoxShape())
wall1.get(BoxShape).withCollisions = true
engine.addEntity(wall1)

const wall2 = new Entity()
wall2.set(new Transform({
  position: new Vector3(3.25, 1, 3),
  scale: new Vector3(1.5, 2, 0.05)
}))
wall2.set(new BoxShape())
wall2.get(BoxShape).withCollisions = true
engine.addEntity(wall2)

// Add actual door to scene. This entity doesn't rotate, its parent drags it with it.
const door = new Entity()
door.set(new Transform({
  position: new Vector3(0.5, 0, 0),
  scale: new Vector3(1, 2, 0.05)
}))
door.set(new BoxShape())
door.get(BoxShape).withCollisions = true
engine.addEntity(door)

// Define a material to color the door red
const doorMaterial = new Material()
doorMaterial.albedoColor = Color3.Red()
doorMaterial.metallic = 0.9
doorMaterial.roughness = 0.1

// Assign the material to the door
door.set(doorMaterial)

// Define wrapper entity to rotate door. This is the entity that actually rotates.
const doorPivot = new Entity()
doorPivot.set(new Transform({
  position: new Vector3(4, 1, 3)
}))
doorPivot.set(new DoorState())
engine.addEntity(doorPivot)

// Set the door as a child of doorPivot
door.setParent(doorPivot)

// Set the click behavior for the door
door.set(
  new OnClick(e => {
    let state = door.getParent().get(DoorState)
    state.closed = !state.closed
  })
)





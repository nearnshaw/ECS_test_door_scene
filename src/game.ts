@Component('doorState')
export class DoorState {
  closed: boolean = true
  constructor(closed : boolean = true){
    this.closed = closed 
  }
}

const doors = engine.getComponentGroup(Transform, DoorState)

export class RotatorSystem {
 
  update(dt: number) {
    for (let entity of doors.entities) {
      let rotation = entity.get(Transform).rotation

      if (entity.get(DoorState).closed == false && rotation.y <= 90) {
        rotation.y += dt * 50
      } else if (entity.get(DoorState).closed == true && rotation.y > 0) {
        rotation.y -= dt * 50
      }
    }
  }
}


const doorMaterial = new Material()
doorMaterial.albedoColor = '#FF0000'
doorMaterial.metallic = 0.9
doorMaterial.roughness = 0.1

// Define fixed walls
const wall1 = new Entity()
wall1.set(new Transform())
wall1.get(Transform).position.set(6, 1, 3)
wall1.get(Transform).scale.set(2, 2, 0.05)
wall1.set(new BoxShape())
wall1.get(BoxShape).withCollisions = true

const wall2 = new Entity()
wall2.set(new Transform())
wall2.get(Transform).position.set(3, 1, 3)
wall2.get(Transform).scale.set(2, 2, 0.05)
wall2.set(new BoxShape())
wall2.get(BoxShape).withCollisions = true

// Define wrapper entity to rotate door. This is the entity that actually rotates.
const doorWrapper = new Entity()
doorWrapper.set(new DoorState())
doorWrapper.set(new Transform())
doorWrapper.get(Transform).position.set(4, 1, 3)
doorWrapper.get(Transform).rotation.set(0, 0, 0)

// Add actual door to scene. This entity doesn't rotate, its parent drags it with it.
const door = new Entity()
door.set(new Transform())
door.get(Transform).position.set(0.5, 0, 0)
door.get(Transform).scale.set(1, 2, 0.05)
door.set(new BoxShape())
door.set(doorMaterial)
door.get(BoxShape).withCollisions = true
door.set(
  new OnClick(_ => {
    let doorClosed = doorWrapper.get(DoorState)
    doorClosed.closed = !doorClosed.closed
  })
)

// Set the door as a child of doorWrapper
door.parent = doorWrapper

// Add all entities to engine
engine.addEntity(wall1)
engine.addEntity(wall2)
engine.addEntity(doorWrapper)
engine.addEntity(door)

// Add system to engine
engine.addSystem(new RotatorSystem())


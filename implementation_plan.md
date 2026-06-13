# Implementation Plan - Replace Direction Buttons with Virtual Joystick

We want to replace the old 4-button directional layout with a modern virtual joystick (圆盘/摇杆).

---

## User Review Required

> [!NOTE]
> We have generated two beautiful flat design circular assets for the virtual joystick base and knob.
> Below are the designs we generated:
>
> ![Joystick Background Base](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/aac147c9-055b-4bf2-8ed1-b3576f6ccd2d/joystick_bg_1780563265056.png)
> 
> ![Joystick Knob Handle](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/aac147c9-055b-4bf2-8ed1-b3576f6ccd2d/joystick_knob_1780563281183.png)

---

## Proposed Changes

### Assets

#### [NEW] [joystick_bg.png](file:///d:/A-Project/7-cocos/dogdo/assets/resources/pic/joystick_bg.png)
Copy the generated background ring texture to resources.

#### [NEW] [joystick_knob.png](file:///d:/A-Project/7-cocos/dogdo/assets/resources/pic/joystick_knob.png)
Copy the generated knob handle texture to resources.

### Scripts

#### [MODIFY] [UILayer.js](file:///d:/A-Project/7-cocos/dogdo/assets/script/ui/scene/game/UILayer.js)
1. **Hide Old Buttons**: In `init()`, hide the old directional area nodes (`upArea`, `downArea`, `leftArea`, `rightArea`).
2. **Build Joystick Nodes**: In `init()`, programmatically create:
   - `this.joystickNode` (the base, positioned at the D-pad center `[255, 190]`, size 160x160).
   - `this.joystickKnob` (the handle inside, size 70x70).
   - Dynamically load the textures using `cc.ResMgr.loadSpriteFrame` and assign them to the Sprite components.
3. **Rewrite Touch Controls**:
   - Limit activation to touches starting within `150px` of the joystick center `[255, 190]`.
   - On Touch Move, calculate the vector from center to touch position:
     - Bound knob offset within `50px` radius.
     - Translate dragging angle (Up, Down, Left, Right) to trigger `cc.Player` controls.
   - On Touch End / Touch Cancel, reset joystick knob to `[0, 0]` and stop player movement.

---

## Verification Plan

### Automated Tests
- Run Node check to verify syntax correctness of `UILayer.js`.

### Manual Verification
- Deploy to Cocos Creator web preview/simulator.
- Touch and drag inside the new virtual joystick area, and verify that the player moves in the correct directions.
- Ensure the knob snaps back to the center and movement stops when touch is released.

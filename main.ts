//% weight=100 color=#008080 icon="\uf043" block="ePaper"
namespace ePaper {

    /**
     * Test function
    */
 /*   //% blockId= ePaperTest
    //% block="test $i"
    //$ i.min=0 i.max=9
    export function test(i: number): number {
        return i + 1
    }
*/
/*
    //% blockId= ePaperTest
    //% block="pokus"
    export function pokus() {
        _pokus()
    }
    //% shim=ePaper::pokus
    function _pokus(): void {
        return
    }
*/
    const WIDTH: number = 200
    const HEIGHT: number = 150

    let UPSIDE_DOWN: boolean = false

    const ARROWOFFSET: number = 40

    const ICONS: string[] = [
        "Heart",
        "SmallH",
        "Yes",
        "No",
        "Happy",
        "Sad",
        "Confus",
        "Angry",
        "Asleep",
        "Surpri",
        "Silly",
        "Fabulo",
        "Meh",
        "TShirt",
        "Roller",
        "Duck",
        "House",
        "Tortoi",
        "Butter",
        "StickF",
        "Ghost",
        "Sword",
        "Giraff",
        "Skull",
        "Umbrel",
        "Snake",
        "Rabbit",
        "Cow",
        "Quarte",
        "EigthN",
        "Pitchf",
        "Target",
        "Triang",
        "LeftTr",
        "Chessb",
        "Diamon",
        "SmallD",
        "Square",
        "SmallS",
        "Scisso",

        "North",
        "NorthE",
        "East",
        "SouthE",
        "South",
        "SouthW",
        "West",
        "NorthW"
    ]

    export enum Color {
        //% block="black" defl=True
        Black = 1,
        //% block="white"
        White = 0,
        ////% block="accent"
        //Accent = 2
    }

    export enum PixelSize {
        //% block="normal (1x)" defl=True
        Normal = 1,
        //% block="double (2x)"
        Double = 2,
        //% block="triple (3x)"
        Triple = 3,
        //% block="quad (4x)"
        Quad = 4
    }

    export enum TextSize {
        //% block="tiny (1x)"
        Tiny = 1,
        //% block="regular (2x)" defl=True
        Regular = 2,
        //% block="medium (3x)"
        Medium = 3,
        //% block="large (4x)"
        Large = 4,
        //% block="extra large (5x)"
        ExtraLarge = 5,
         //% block="huge (6x)"
        Huge = 6,
         //% block="massive (7x)"
        Massive = 7
   }

    let _pixelSize: number = 1

    function tokenize(text: string): string {
        let result: string = ""
        let icon: string = ""

        for (let x = 0; x < text.length; x++) {
            let char: string = text.charAt(x)
            if (char == "}" && icon.length > 0) {
                let index: number = ICONS.indexOf(icon.substr(1, 6))
                icon += char

                if (index > -1) {
                    icon = String.fromCharCode(DAL.MICROBIT_FONT_ASCII_END + 1 + index)
                }

                result += icon
                icon = ""
                continue
            }
            if (char == "{" || icon.length > 0) {
                icon += char
                continue
            }
            result += char
        }

        return result
    }

    /**
     * Display an icon on ePaper
     * @param icon - icon to display
     * @param x - x position (0-199)
     * @param y - y position (0-149)
     * @param color - color to set (0-1)
     */
    /*
    //% blockId=inkybit_draw_icon
    //% block="draw icon %icon| at x %x| y %y| with color %color| and size %size"
    //% icon.fieldEditor="gridpicker"
    //% icon.fieldOptions.width="400" icon.fieldOptions.columns="5"
    //% icon.fieldOptions.itemColour="black" icon.fieldOptions.tooltips="true"
    //% x.min=0 x.max=199
    //% y.min=0 y.max=149
    */
    export function drawIcon(icon: IconNames, x: number, y: number, color: Color = Color.Black, size: TextSize = TextSize.Regular): void {
        let image: Image = images.iconImage(icon)
        drawImage(image, x, y, color, size)
    }

    /**
     * Display an arrow on ePaper
     * @param arrow - arrow to display
     * @param x - x position (0-199)
     * @param y - y position (0-149)
     * @param color - color to set (0-1)
     */
    /*
    //% blockId=inkybit_draw_arrow
    //% block="draw arrow %arrow| at x %x| y %y| with color %color| and size %size"
    //% x.min=0 x.max=199
    //% y.min=0 y.max=149
    */
    export function drawArrow(arrow: ArrowNames, x: number, y: number, color: Color = Color.Black, size: TextSize = TextSize.Regular): void {
        let image: Image = images.arrowImage(arrow)
        drawImage(image, x, y, color, size)
    }

    /**
     * Draw an image on ePaper
     * @param image - image to display
     * @param x - x position (0-199)
     * @param y - y position (0-149)
     * @param color - color to set (0-1)
     */
    //% blockId=inkybit_draw_image
    //% block="draw image %image| at x %x| y %y| with color %color| and size %size"
    //% x.min=0 x.max=199
    //% y.min=0 y.max=149
    export function drawImage(image: Image, x: number, y: number, color: Color = Color.Black, size: TextSize = TextSize.Regular): void {
        let rows: number = 5 * size
        let cols: number = image.width() * size
        for (let c_row = 0; c_row < rows; c_row++) {
            let s_row: number = Math.floor(c_row / size)
            for (let c_col = 0; c_col < cols; c_col++) {
                let s_col: number = Math.floor(c_col / size)
                if (image.pixelBrightness(s_col, s_row)) {
                    setPixel(x + c_col, y + c_row, color)
                }
            }
        }
    }

    /**
     * Set an pixel on ePaper
     * @param x - x position (0-199)
     * @param y - y position (0-149)
     * @param color - color to set (0-1)
     */
    //% blockId=inkybit_set_pixel
    //% block="set pixel at x %x| y %y| with color %color"
    //% x.min=0 x.max=199
    //% y.min=0 y.max=149
    export function setPixel(x: number, y: number, color: Color = Color.Black): void {
        x *= _pixelSize
        y *= _pixelSize
        let c: number = color
        let px: number = 0
        let py: number = 0
        for (py = 0; py < _pixelSize; py++) {
            for (px = 0; px < _pixelSize; px++) {
                _setPixel(x + px, y + py, c)
            }
        }
        return
    }

    /**
     * Draw a rectangle on ePaper
     * @param x - x position (0-199)
     * @param y - y position (0-149)
     * @param width - width (0-199)
     * @param height - height (0-149)
     * @param color - color to set (0-1)
     * @param filled - whether to fill the rectangle with color
     */
    //% blockId=inkybit_draw_rectangle
    //% block="draw rectangle at x %x| y %y| width %width| height %height| color %color| filled %filled"
    //% x.min=0 x.max=199
    //% y.min=0 y.max=149
    //% width.min=0 width.max=199
    //% width.min=0 width.max=149
    export function drawRectangle(x: number, y: number, width: number, height: number, color: Color = Color.Black, filled: Boolean = false): void {
        let c: number = color
        let px: number = 0
        let py: number = 0
        /*
          x, y          x+w, y

          x, y+h        x+w, y+h
        */
        drawLine(x, y, x + width, y, c)
        drawLine(x, y, x, y + height, c)
        drawLine(x + width, y, x + width, y + height, c)
        drawLine(x, y + height, x + width, y + height, c)

        if (filled) {
            x += 1
            y += 1
            width -= 2
            height -= 2
            for (py = y; py <= y + height; py++) {
                for (px = x; px <= x + width; px++) {
                    _setPixel(px, py, c)
                }
            }
        }
    }

    /**
     * Draw a line on ePaper
     * @param x0 - start x position (0-199)
     * @param y0 - start y position (0-149)
     * @param x1 - end x position (0-199)
     * @param y1 - end y position (0-149)
     * @param color - color to set (0-1)
     */
    //% blockId=inkybit_draw_line
    //% block="draw line from x %x0 y %y0| to x %x1 y %y1| color %color"
    //% x0.min=0 x0.max=199
    //% y0.min=0 y0.max=149
    //% x1.min=0 x1.max=199
    //% y1.min=0 y1.max=149
    export function drawLine(x0: number, y0: number, x1: number, y1: number, color: Color = Color.Black): void {
        let c: number = color
        let dx: number = Math.abs(x1 - x0)
        let sx: number = x0 < x1 ? 1 : -1
        let dy: number = -Math.abs(y1 - y0)
        let sy: number = y0 < y1 ? 1 : -1

        let err: number = dx + dy;  /* error value e_xy */
        while (true) {  /* loop */
            _setPixel(x0, y0, c)
            if (x0 == x1 && y0 == y1) break;
            let e2: number = 2 * err;
            if (e2 >= dy) { /* e_xy+e_x > 0 */
                err += dy;
                x0 += sx;
            }
            if (e2 <= dx) { /* e_xy+e_y < 0 */
                err += dx;
                y0 += sy;
            }
        }
    }

        /**
    * Draw a line on ePaper
    * @param x0 - start x position (0-199)
    * @param y0 - start y position (0-149)
    * @param angle - angle (0-360)
    * @param length - length (0-199)
    * @param color - color to set (0-1)
    */
    //% blockId=inkybit_draw_line_angle
    //% block="draw line from x %x y %y| with angle %angle| and length %length| color %color"
    //% x.min=0 x.max=199
    //% y.min=0 y.max=149
    //% angle.min=0 angle.max=360
    //% length.min=0 length=199
    export function drawLineAngle(x: number, y: number, angle: number = 0, length: number, color: Color = Color.Black): void {
        const angleRad = angle * Math.PI / 180;
        drawLine(x, y, Math.round(x + Math.sin(angleRad) * length), Math.round(y + Math.cos(angleRad) * length), color);
    }

    /**
     * Set ePaper pixel size
     * @param size - pixel size (1 to 4)
     */
    //% blockId=inkybit_set_pixel_size
    //% block="set pixel size to %size"
    //% advanced
    //% size.defl=1
    export function setPixelSize(size: PixelSize = PixelSize.Normal): void {
        _pixelSize = size
    }

    /**
     * Get ePaper pixel size
     */
    //% blockId=inkybit_get_pixel_size
    //% block="get pixel size"
    //% advanced
    export function getPixelSize(): PixelSize {
        return _pixelSize
    }

    /**
     * Measure text, returns a length in pixels
     * @param text - text to measure
     */
    //% blockId=inkybit_measure_text
    //% block="get length of %text in pixels| at size %size"
    //% advanced
    export function measureText(text: string, size: TextSize = TextSize.Regular): number {
        let len: number = 0
        for (let x: number = 0; x < text.length; x++) {
            len += charWidth(text.charAt(x), size) + (1 * size)
        }
        return len
    }

    /**
     * Draw a single alphanumeric character.
     * @param char - character to display
     * @param x - x position (0-199)
     * @param y - y position (0-149)
     * @param color - color to set (0-1)
     */
    export function drawChar(char: string, x: number, y: number, color: Color = Color.Black, size: TextSize = TextSize.Regular): void {
        let rows: number = 5 * size
        let cols: number = 5 * size

        if (char.charCodeAt(0) > DAL.MICROBIT_FONT_ASCII_END + ARROWOFFSET) {
            drawArrow(char.charCodeAt(0) - DAL.MICROBIT_FONT_ASCII_END - ARROWOFFSET - 1, x, y, color, size)
            return
        }
        if (char.charCodeAt(0) > DAL.MICROBIT_FONT_ASCII_END) {
            drawIcon(char.charCodeAt(0) - DAL.MICROBIT_FONT_ASCII_END - 1, x, y, color, size)
            return
        }
        let data: Buffer = getChar(char)
        for (let c_row = 0; c_row < rows; c_row++) {
            let s_row: number = Math.floor(c_row / size)
            for (let c_col = 0; c_col < cols; c_col++) {
                let s_col: number = Math.floor(c_col / size)
                if ((data[s_row] & (1 << (4 - s_col))) > 0) {
                    setPixel(x + c_col, y + c_row, color)
                }
            }
        }
    }

    /**
     * Draw text on ePaper
     */
    //% blockId=inkybit_draw_text
    //% block="draw text %text| at x %x| y %y| with color %color| and size %size"
    //% x.min=0 x.max=199
    //% y.min=0 y.max=149
    //export function drawText(text: string, x: number, y: number, color: Color = Color.Black, size: number = 1): void {
    export function drawText(text: string, x: number, y: number, color: Color = Color.Black, size: TextSize = TextSize.Regular): void {
        text = tokenize(text)
        _drawText(text, x, y, color, size)
    }
    export function _drawText(text: string, x: number, y: number, color: Color = Color.Black, size: TextSize = TextSize.Regular): void {
        let o_x: number = x
        for (let char_index: number = 0; char_index < text.length; char_index++) {
            let width: number = charWidth(text.charAt(char_index), size)
            if ((x + width) * _pixelSize >= WIDTH) {
                y += 6 * size // New line, 5px tall + 1px gap
                x = o_x
            }
            drawChar(text.charAt(char_index), x, y, color, size)
            x += width + (1 * size) // 1px space between chars
        }
    }

    /**
     * Return the width of ePaper
     */
    //% blockId=scrollbit_cols
    //% block="width"
    //% icon=""
    export function width(): number {
        return WIDTH
    }

    /**
     * Return the height of ePaper
     */
    //% blockId=inkybit_height
    //% block="height"
    //% icon=""
    export function height(): number {
        return HEIGHT
    }

    /**
     * Update ePaper,
     * update the e-ink display with your pretty pixels
     */
    //% blockId=inkybit_show
    //% block="display your changes"
    export function show() {
        _show()
        _update()
    }

    /**
     * Update ePaper,
     * update fast the e-ink display with your pretty pixels
     */
    //% blockId= inkybit_show_fast
    //% block="fast display your changes"
    export function show_fast() {
        _show()
        _update_fast()
    }

    /**
     * Clear ePaper,
     * clear the e-ink display for a blank canvas
     */
    //% blockId=inkybit_clear
    //% block="clear the display with color %color"
    export function clear(color: Color = Color.White) {
        if (color == Color.White) _clear(0xFF)
        else _clear(0x00)
    }

    // /**
    //  * Clear a rectangle on ePaper
    //  * @param x - x position (0-199)
    //  * @param y - y position (0-149)
    //  * @param width - width (0-199)
    //  * @param height - height (0-149)
    //  */
    // // % blockId=inkybit_clear_rectangle
    // // % block="clear rectangle at x %x| y %y| width %width| height %height"
    // // % x.min=0 x.max=199
    // // % y.min=0 y.max=149
    // // % width.min=0 width.max=199
    // // % width.min=0 width.max=149
    // export function clearRectangle(x: number, y: number, width: number, height: number): void {
    //     let c: number = Color.White
    //     let ly: number = 0
    //     for (ly = y; ly <= y + height; ly++) {
    //         drawLine(x, ly, x + width, ly, c)
    //     }
    // }

    export function init() {
        _init()
    }

    export function fast_init() {
        _fast_init()
    }

    //% blockId= ePaperSleep
    //% block="sleep"
    export function sleep() {
        _sleep()
    }

    //% blockId= ePaperWakeUp
    //% block="wake up"
    export function wake_up() {
        _slow_init()
    }

    //% shim=ePaper::show
    function _show(): void {
        return
    }

    //% shim=ePaper::update_fast
    function _update_fast(): void {
        return
    }

    //% shim=ePaper::update
    function _update(): void {
        return
    }

    //% shim=ePaper::clear
    function _clear(color :number): void {
        return
    }

    //% shim=ePaper::setPixel
    function _setPixel(x: number, y: number, color: number): void {
        return
    }

    //% shim=ePaper::init
    function _init(): void {
        return
    }

    //% shim=ePaper::fast_init
    function _fast_init(): void {
        return
    }

    //% shim=ePaper::slow_init
    function _slow_init(): void {
        return
    }

    //% shim=ePaper::sleep
    function _sleep(): void {
        return
    }

    // Font bindings

    //% shim=ePaper::getFontDataByte
    function getFontDataByte(index: number): number {
        return 0
    }

    //% shim=ePaper::getFontData
    function getFontData(index: number): Buffer {
        return pins.createBuffer(5)
    }

    //% shim=ePaper::getCharWidth
    function getCharWidth(char: number): number {
        return 5
    }

    function getChar(character: string): Buffer {
        return getFontData(character.charCodeAt(0))
    }

    function charWidth(character: string, size: TextSize = TextSize.Regular): number {
        let charcode: number = character.charCodeAt(0)
        if (charcode > DAL.MICROBIT_FONT_ASCII_END) {
            return 5 * size
        }
        return getCharWidth(charcode) * size
    }


    /**
     * Draw an ellipse with center (x, y), radii rx, ry, rotation angle (degrees),
     * and optional color + fill. 
     */
    //% blockId=inkybit_draw_ellipse
    //% block="draw ellipse with center at x %cx| y %cy| radii at x %rx| y %ry| rotation angle %angle| color %color| and filled %filled"
export function drawEllipse(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    angle: number = 0,
    color: Color = Color.Black,
    filled: boolean = false
): void {
    const angleRad = angle * Math.PI / 180;
    const c : number = color;
    // Normalize radii
    rx = Math.abs(rx) | 0;
    ry = Math.abs(ry) | 0;
    if (rx === 0 && ry === 0) return; // nothing to draw

    // Axis-aligned fast path (angle ~ 0)
    if (angle === 0) {
        drawEllipseAxisAligned(cx, cy, rx, ry, c, filled);
        return;
    }

    // Rotated ellipse path: sample parametric curve → polygon → draw outline and fill
    drawEllipseRotated(cx, cy, rx, ry, angleRad, c, filled);
}

/* ============================= Helpers ============================= */

// Fast axis-aligned ellipse
function drawEllipseAxisAligned(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    c: Color,
    filled: boolean
): void {
    if (rx === 0) {
        // Vertical line (degenerate ellipse)
        const y0 = cy - ry, y1 = cy + ry;
        for (let y = y0; y <= y1; y++) setPixel(cx, y, c);
        return;
    }
    if (ry === 0) {
        // Horizontal line (degenerate ellipse)
        const x0 = cx - rx, x1 = cx + rx;
        for (let x = x0; x <= x1; x++) setPixel(x, cy, c);
        return;
    }

    // Outline using midpoint ellipse algorithm for high-quality rasterization
    midpointEllipseOutline(cx, cy, rx, ry, c);

    if (!filled) return;

    // Fast scanline fill: for each y, fill between left/right ellipse x-extents.
    const yStart = cy - ry;
    const yEnd = cy + ry;
    for (let y = yStart; y <= yEnd; y++) {
        const dy = y - cy;
        // rx * sqrt(1 - (dy^2 / ry^2))
        const inside = 1 - (dy * dy) / (ry * ry);
        if (inside < 0) continue; // numerical guard
        const span = Math.floor(rx * Math.sqrt(inside));
        const x0 = cx - span;
        const x1 = cx + span;
        if (x0 > x1) continue;
        for (let x = x0; x <= x1; x++) setPixel(x, y, c);
    }
}

// Midpoint ellipse outline (axis-aligned)
function midpointEllipseOutline(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    c: number
): void {
    // Based on the standard midpoint ellipse rasterization with four-way symmetry
    const rx2 = rx * rx;
    const ry2 = ry * ry;
    const twoRx2 = 2 * rx2;
    const twoRy2 = 2 * ry2;

    let x = 0;
    let y = ry;

    // Decision parameter for region 1
    let dx = ry2 * x * 2;
    let dy = rx2 * y * 2;
    let d1 = ry2 - rx2 * ry + 0.25 * rx2;

    // Region 1: slope > -1
    while (dx < dy) {
        plotFour(cx, cy, x, y, c);
        if (d1 < 0) {
            x++;
            dx += twoRy2;
            d1 += dx + ry2;
        } else {
            x++;
            y--;
            dx += twoRy2;
            dy -= twoRx2;
            d1 += dx - dy + ry2;
        }
    }

    // Decision parameter for region 2
    let d2 = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;

    // Region 2: slope <= -1
    while (y >= 0) {
        plotFour(cx, cy, x, y, c);
        if (d2 > 0) {
            y--;
            dy -= twoRx2;
            d2 += rx2 - dy;
        } else {
            y--;
            x++;
            dx += twoRy2;
            dy -= twoRx2;
            d2 += dx - dy + rx2;
        }
    }

    function plotFour(cx: number, cy: number, x: number, y: number, c: number) {
        setPixel(cx + x, cy + y, c);
        setPixel(cx - x, cy + y, c);
        setPixel(cx + x, cy - y, c);
        setPixel(cx - x, cy - y, c);
    }
}

// Rotated ellipse via polygon sampling + even–odd scanline fill
function drawEllipseRotated(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    angleRad: number,
    c: number,
    filled: boolean
): void {
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    // Choose number of segments based on approximate circumference (Ramanujan)
    const h = Math.pow((rx - ry), 2) / Math.pow((rx + ry), 2);
    const circumferenceApprox = Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    const steps = Math.max(24, Math.ceil(circumferenceApprox)); // ~1 px per segment

    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        const ex = rx * Math.cos(t);
        const ey = ry * Math.sin(t);
        // Rotate by angle: (x', y') = R * (ex, ey)
        const xr = ex * cosA - ey * sinA;
        const yr = ex * sinA + ey * cosA;
        pts.push({
            x: Math.round(cx + xr),
            y: Math.round(cy + yr),
        });
    }


    // Close the polygon
    pts.push(pts[0]);

    // Outline: connect consecutive points (for continuity)
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        drawLine(p0.x, p0.y, p1.x, p1.y, c);
    }

    if (!filled) return;

    // Even–odd scanline fill of the polygon
    fillPolygonEvenOdd(pts, c);
}

// Generic polygon even–odd scanline fill using drawHLine (or per-pixel fallback)
function fillPolygonEvenOdd(
    pts: { x: number; y: number }[],
    c: number
): void {
    let minY = Infinity, maxY = -Infinity;
    for (const p of pts) {
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    }
    if ((minY == Infinity) || (maxY == -Infinity)) return;

    for (let y = minY; y <= maxY; y++) {
        const xIntersections: number[] = [];

        // Build intersections with scanline y
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i];
            const p1 = pts[i + 1];
            const y0 = p0.y, y1 = p1.y;

            // Skip horizontal edges
            if (y0 === y1) continue;

            // Ensure y0 < y1
            const upper = y1 > y0 ? p1 : p0;
            const lower = y1 > y0 ? p0 : p1;
            const yMin = lower.y;
            const yMax = upper.y;

            // Standard even–odd rule: include upper endpoint, exclude lower
            if (y > yMin && y <= yMax) {
                const x0 = lower.x;
                const x1 = upper.x;
                const x = x0 + (x1 - x0) * ((y - yMin) / (yMax - yMin));
                xIntersections.push(x);
            }
        }

        if (xIntersections.length < 2) continue;

        xIntersections.sort((a, b) => a - b);

        // Fill between pairs
        for (let k = 0; k + 1 < xIntersections.length; k += 2) {
            const xStart = Math.floor(xIntersections[k]);
            const xEnd = Math.floor(xIntersections[k + 1]);
            if (xEnd < xStart) continue;
            for (let x = xStart; x <= xEnd; x++) _setPixel(x, y, c);
        }
    }
}

}


//pins.spiFrequency(4000000)
ePaper.init()

/*
pins.digitalWritePin(12,0) // DC
pins.digitalWritePin(8,0)  // CS
pins.digitalWritePin(2,0) // RESET
pins.digitalReadPin(16) // BUSY
*/


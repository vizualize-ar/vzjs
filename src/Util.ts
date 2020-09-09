export class Util {
  public static PointerDelta(point1: PointerEvent, point2: PointerEvent) {
    if (!point1 || !point2) return 0;
    // use pythagorean theorem to calculate distance between the two points
    const delta = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    return delta;
  }
}
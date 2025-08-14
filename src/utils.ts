export function snakeToTitle(snake: string): string {
  return snake
    .split('_')
    .filter(Boolean) // remove empty parts in case of "__"
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

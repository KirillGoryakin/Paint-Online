interface CommonFigure {
  color: string;
  lineWidth: number;
};
interface FigureBrush extends CommonFigure {
  tool: 'brush' | 'eraser';
  coords: {x: number; y: number;}[];
};
interface FigureDrag extends CommonFigure {
  tool: 'line' | 'rect' | 'circle';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
interface FigureClear extends CommonFigure {
  tool: 'clear';
  w: number;
  h: number;
};
export type Figure = FigureBrush | FigureDrag | FigureClear;
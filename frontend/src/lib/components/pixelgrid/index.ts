export interface GridDimensions {
	width: number;
	height: number;
}

export function generateRandomColor(): string {
	const colors = ['hsl(var(--primary))'];
	const baseColor = colors[Math.floor(Math.random() * colors.length)];
	const alpha = Math.random() * (0.9 - 0.2);
	return `${baseColor.slice(0, -1)} / ${alpha.toFixed(2)})`;
}

export function calculateGridDimensions(element: HTMLDivElement): GridDimensions {
	const { offsetWidth: width, offsetHeight: height } = element;
	return { width, height };
}

export function calculateNumberOfPixels(dimensions: GridDimensions, pixelSize: number): number {
	return Math.floor(dimensions.width / pixelSize) * Math.floor(dimensions.height / pixelSize);
}

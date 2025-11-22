# Pranks Folder Structure

This folder contains all the prank images organized by room. Each room has its own subfolder with specific prank types.

## Folder Structure
```
pranks/
├── living-room/
│   ├── sharpie-face.png
│   ├── toilet-paper.png
│   └── food-mess.png
├── kitchen/
│   ├── sharpie-face.png
│   ├── toilet-paper.png
│   └── food-mess.png
├── bathroom/
│   ├── sharpie-face.png
│   ├── toilet-paper.png
│   └── food-mess.png
└── bedroom/
    ├── sharpie-face.png
    ├── toilet-paper.png
    └── food-mess.png
```

## Adding Prank Images

1. **File Names**: Use the exact names shown above (sharpie-face.png, toilet-paper.png, food-mess.png)
2. **Format**: PNG format recommended for transparency support
3. **Size**: Recommended 60x60 pixels or larger (will be scaled down automatically)
4. **Transparency**: Use transparent backgrounds for better integration

## Prank Types

- **sharpie-face**: Sharpie drawings and marks
- **toilet-paper**: Toilet paper chaos and streamers
- **food-mess**: Food-related messes and spills

## How It Works

The JavaScript code automatically loads these images based on the room and prank type. When you add new PNG files, they will automatically appear in the game without any code changes needed. 
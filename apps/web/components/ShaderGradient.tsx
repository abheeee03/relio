"use client"
import React from 'react'
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

function ShaderGradientComponent() {
    return (
        <ShaderGradientCanvas
            style={{
                width: '100%',
                height: '100%',
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1
            }}
            lazyLoad={undefined}

            fov={undefined}
            pixelDensity={1}
            pointerEvents="none"
        >
            <ShaderGradient
                animate="on"
                type="plane"
                wireframe={false}
                shader="defaults"
                uTime={13.5}
                uSpeed={0.08}
                uStrength={1.5}
                uDensity={1.5}
                uFrequency={0}
                uAmplitude={0}
                positionX={-0.3}
                positionY={0.1}
                positionZ={-1.2}
                rotationX={-6}
                rotationY={160}
                rotationZ={89}
                color1="#242880"
                color2="#8d7dca"
                color3="#393939"
                reflection={0.1}

                // View (camera) props
                cAzimuthAngle={180}
                cPolarAngle={80}
                cDistance={2.8}
                cameraZoom={9.1}

                // Effect props
                lightType="3d"
                brightness={1}
                envPreset="city"
                grain="on"

                // Tool props
                toggleAxis={false}
                zoomOut={false}
                hoverState=""

                // Optional - if using transition features
                enableTransition={false}
            />
        </ShaderGradientCanvas>
    )
}

export default ShaderGradientComponent
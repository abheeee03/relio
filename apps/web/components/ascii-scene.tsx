"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { OrbitControls } from "@react-three/drei"
import { Vector2, Shape, ExtrudeGeometry, Group } from "three"
import { AsciiEffect } from "./ascii-effect"

function Gear({
    radius = 1,
    teeth = 12,
    toothDepth = 0.2,
    thickness = 0.3,
    holeRadius = 0.3,
    position = [0, 0, 0] as [number, number, number],
    rotationSpeed = 1,
    color = "#2b00ff"
}: {
    radius?: number
    teeth?: number
    toothDepth?: number
    thickness?: number
    holeRadius?: number
    position?: [number, number, number]
    rotationSpeed?: number
    color?: string
}) {
    const meshRef = useRef<Group>(null)

    const geometry = useMemo(() => {
        const shape = new Shape()
        const outerRadius = radius
        const innerRadius = radius - toothDepth

        for (let i = 0; i < teeth; i++) {
            const angle1 = (i / teeth) * Math.PI * 2
            const angle2 = ((i + 0.3) / teeth) * Math.PI * 2
            const angle3 = ((i + 0.5) / teeth) * Math.PI * 2
            const angle4 = ((i + 0.8) / teeth) * Math.PI * 2

            if (i === 0) {
                shape.moveTo(Math.cos(angle1) * innerRadius, Math.sin(angle1) * innerRadius)
            }
            shape.lineTo(Math.cos(angle2) * innerRadius, Math.sin(angle2) * innerRadius)
            shape.lineTo(Math.cos(angle2) * outerRadius, Math.sin(angle2) * outerRadius)
            shape.lineTo(Math.cos(angle3) * outerRadius, Math.sin(angle3) * outerRadius)
            shape.lineTo(Math.cos(angle4) * innerRadius, Math.sin(angle4) * innerRadius)
        }
        shape.closePath()
        const holePath = new Shape()
        holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false)
        shape.holes.push(holePath)

        const extrudeSettings = {
            depth: thickness,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 2,
        }

        return new ExtrudeGeometry(shape, extrudeSettings)
    }, [radius, teeth, toothDepth, thickness, holeRadius])

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += delta * rotationSpeed
        }
    })

    return (
        <group ref={meshRef} position={position}>
            <mesh geometry={geometry} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
            </mesh>
        </group>
    )
}

function Gears() {
    return (
        <group>
            <Gear
                radius={1.2}
                teeth={16}
                toothDepth={0.15}
                thickness={0.25}
                holeRadius={0.25}
                position={[0, 0, 0]}
                rotationSpeed={0.5}
                color="#D4A373"
            />
        </group>
    )
}

export function EffectScene() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = useState(new Vector2(0, 0))
    const [resolution, setResolution] = useState(new Vector2(1920, 1080))

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = rect.height - (e.clientY - rect.top)
                setMousePos(new Vector2(x, y))
            }
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("mousemove", handleMouseMove)

            const rect = container.getBoundingClientRect()
            setResolution(new Vector2(rect.width, rect.height))

            const handleResize = () => {
                const rect = container.getBoundingClientRect()
                setResolution(new Vector2(rect.width, rect.height))
            }
            window.addEventListener("resize", handleResize)

            return () => {
                container.removeEventListener("mousemove", handleMouseMove)
                window.removeEventListener("resize", handleResize)
            }
        }
    }, [])

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
            <Canvas
                camera={{ position: [0, 5, 5], fov: 30 }}
            >
                <hemisphereLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <directionalLight position={[-5, 3, -5]} intensity={1.2} />
                <Gears />

                <OrbitControls enableDamping enableZoom={false} />

                {/* ASCII Effect with PostFX */}
                <EffectComposer>
                    <AsciiEffect
                        //@ts-ignore
                        style="standard"
                        cellSize={4}
                        invert={false}
                        color={false}
                        resolution={resolution}
                        mousePos={mousePos}
                        postfx={{
                            preset: "none",
                            scanlineIntensity: 0,
                            scanlineCount: 200,
                            targetFPS: 0,
                            jitterIntensity: 0,
                            jitterSpeed: 1,
                            mouseGlowEnabled: false,
                            mouseGlowRadius: 200,
                            mouseGlowIntensity: 1.5,
                            vignetteIntensity: 0,
                            vignetteRadius: 0.8,
                            colorPalette: "original",
                            curvature: 0,
                            aberrationStrength: 0,
                            noiseIntensity: 0,
                            noiseScale: 1,
                            noiseSpeed: 1,
                            waveAmplitude: 0,
                            waveFrequency: 10,
                            waveSpeed: 1,
                            glitchIntensity: 0,
                            glitchFrequency: 0,
                            brightnessAdjust: 0,
                            contrastAdjust: 1
                        }}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
import * as React from "react"

import { cn } from "@/lib/utils"

const REVEAL_STEP_MS = 60
const MAX_REVEAL_DELAY_MS = 360
let revealIndex = 0

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  (
    {
      className,
      style,
      onPointerMove,
      onPointerLeave,
      onPointerEnter,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null)
    const rafRef = React.useRef<number | null>(null)
    const lastPointRef = React.useRef<{ x: number; y: number } | null>(null)
    const delayRef = React.useRef<number | null>(null)

    if (delayRef.current === null) {
      delayRef.current = Math.min(revealIndex * REVEAL_STEP_MS, MAX_REVEAL_DELAY_MS)
      revealIndex += 1
    }

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        cardRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [ref]
    )

    React.useEffect(() => {
      const el = cardRef.current
      if (!el) return

      if (prefersReducedMotion()) {
        el.dataset.revealed = "true"
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.dataset.revealed = "true"
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
      )

      observer.observe(el)
      return () => observer.disconnect()
    }, [])

    const applyTilt = React.useCallback(() => {
      const el = cardRef.current
      const lastPoint = lastPointRef.current
      if (!el || !lastPoint) return

      const rect = el.getBoundingClientRect()
      const x = lastPoint.x - rect.left
      const y = lastPoint.y - rect.top
      const nx = (x / rect.width) * 2 - 1
      const ny = (y / rect.height) * 2 - 1
      const tiltX = (-ny * 6).toFixed(2)
      const tiltY = (nx * 8).toFixed(2)

      el.style.setProperty("--tilt-x", `${tiltX}deg`)
      el.style.setProperty("--tilt-y", `${tiltY}deg`)
      el.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`)
      el.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`)
    }, [])

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event)

        if (event.pointerType !== "mouse") return
        lastPointRef.current = { x: event.clientX, y: event.clientY }

        if (rafRef.current !== null) return
        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = null
          applyTilt()
        })
      },
      [applyTilt, onPointerMove]
    )

    const handlePointerLeaveInternal = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event)

        const el = cardRef.current
        if (!el) return
        lastPointRef.current = null
        el.style.setProperty("--tilt-x", "0deg")
        el.style.setProperty("--tilt-y", "0deg")
        el.style.setProperty("--glow-x", "50%")
        el.style.setProperty("--glow-y", "50%")
      },
      [onPointerLeave]
    )

    const handlePointerEnterInternal = React.useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerEnter?.(event)
      },
      [onPointerEnter]
    )

    return (
      <div
        data-slot="card"
        ref={setRefs}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeaveInternal}
        onPointerEnter={handlePointerEnterInternal}
        style={{
          ...(style || {}),
          ["--reveal-delay" as never]: `${delayRef.current ?? 0}ms` as never,
        }}
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm card-pop",
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

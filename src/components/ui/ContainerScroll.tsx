"use client";
import React, { useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  MotionValue,
  useReducedMotion,
} from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  // Respeita prefers-reduced-motion — sem rotação 3D se usuário preferir
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [20, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -100]
  );

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{ perspective: "1000px" }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="max-w-5xl mx-auto text-center mb-8"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        // Sombra com tom gold sutil — identidade Admirata
        boxShadow: `
          0 0 0 1px rgba(184, 150, 12, 0.15),
          0 9px 20px rgba(26, 26, 46, 0.4),
          0 37px 37px rgba(26, 26, 46, 0.35),
          0 84px 50px rgba(26, 26, 46, 0.2),
          0 149px 60px rgba(26, 26, 46, 0.08),
          0 233px 65px rgba(26, 26, 46, 0.02)
        `,
      }}
      className="
        max-w-5xl -mt-12 mx-auto
        h-[30rem] md:h-[40rem] w-full
        border border-[var(--color-gold)]/20
        p-2 md:p-6
        bg-[var(--color-ink)]
        rounded-[30px]
      "
    >
      {/* Inner frame — stone para contrastar com ink */}
      <div
        className="
          h-full w-full overflow-hidden
          rounded-2xl
          bg-[var(--color-stone)]
          md:p-4
        "
      >
        {children}
      </div>
    </motion.div>
  );
};

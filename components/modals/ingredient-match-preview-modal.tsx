"use client";

import Image from "next/image";
import Button from "@/components/button";
import type { Ingredient } from "@/data/ingredients";
import { shapeOptions } from "@/domain/ingredients-match-options";

type IngredientMatchPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient;
};

export default function IngredientMatchPreviewModal({ isOpen, onClose, ingredient }: IngredientMatchPreviewModalProps) {
  if (!isOpen) return null;

  const wrongShape = shapeOptions.find((shape) => shape.id !== ingredient.shapeId);

  return (
    <div
      role='dialog'
      aria-modal='true'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6'
    >
      <div
        className='grid w-full max-w-6xl grid-cols-[1fr_240px] gap-5 rounded-4xl bg-white p-5 shadow-2xl
        '
      >
        {/* Left preview area */}
        <section
          className='
            relative h-130 overflow-hidden
            rounded-4xl bg-emerald-300
          '
        >
          {/* Left options */}
          <div className='absolute left-10 top-30 flex flex-col gap-10'>
            {/* Correct colour option */}
            <button
              aria-label={`${ingredient.color} colour option`}
              className='
                h-28 w-28 rounded-full
                border-4 border-white shadow
              '
              style={{ backgroundColor: ingredient.color }}
            />

            {/* Wrong shape option */}
            <button
              aria-label={wrongShape?.label ?? "Wrong shape option"}
              className='
                flex h-28 w-28 items-center justify-center
                rounded-3xl border-4 border-white
                bg-white p-4 shadow
              '
            >
              {wrongShape?.imageSrc ? (
                <img src={wrongShape.imageSrc} alt={wrongShape.label} className='h-full w-full object-contain' />
              ) : (
                <span className='text-sm font-bold text-slate-800'>{wrongShape?.label ?? "Shape"}</span>
              )}
            </button>
          </div>

          {/* Target ingredient */}
          <div className='absolute right-24 top-1/2 -translate-y-1/2'>
            <div className='flex flex-col items-center gap-5'>
              <div
                className='
                  relative flex h-44 w-44 items-center justify-center
                  overflow-hidden rounded-4xl bg-white shadow
                '
              >
                <Image
                  src={ingredient.imageSrc}
                  alt={ingredient.imageAlt}
                  width={180}
                  height={180}
                  className='h-36 w-36 object-contain'
                  draggable={false}
                />
              </div>

              <div
                className='
                  max-w-xs rounded-2xl bg-white/95
                  px-5 py-3 text-center text-sm
                  font-bold text-slate-800 shadow
                '
              >
                Watch how to choose an option and connect it to the ingredient.
              </div>
            </div>
          </div>

          {/* Static cursor placeholder */}
          <img
            src='/assets/tutorial/mouse-default.svg'
            alt=''
            aria-hidden='true'
            className='
              pointer-events-none absolute z-20
              h-14 w-14
            '
            style={{
              left: 80,
              top: 390,
            }}
          />
        </section>

        {/* Right instruction panel */}
        <aside
          className='
            flex flex-col justify-between
            rounded-4xl bg-slate-100
            p-5 text-center shadow-inner
          '
        >
          <div>
            <h2 className='text-xl font-extrabold text-slate-800'>How to play</h2>

            <p className='mt-3 text-sm font-semibold text-slate-600'>
              Watch the finger choose an option, click it, then connect it to the ingredient.
            </p>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <img src='/assets/tutorial/mouse-inactive.svg' alt='Mouse preview' className='h-28 w-28 object-contain' />

            <p
              className='
                rounded-2xl bg-white px-4 py-3
                text-sm font-bold text-slate-700 shadow
              '
            >
              Move
            </p>
          </div>

          <div className='flex w-full gap-3'>
            <Button className='flex-1'>Replay</Button>

            <Button onClick={onClose} className='flex-1'>
              Close
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

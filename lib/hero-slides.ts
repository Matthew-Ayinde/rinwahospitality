import { z } from 'zod';

const optionalUrlSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : value),
  z.union([z.string().url('Invalid URL'), z.literal(''), z.undefined()])
);

function requireExactlyOneMedia(data: { imageUrl?: string; videoUrl?: string }, ctx: z.RefinementCtx, mode: 'create' | 'update') {
  const imageFieldSent = data.imageUrl !== undefined;
  const videoFieldSent = data.videoUrl !== undefined;

  if (mode === 'update' && !imageFieldSent && !videoFieldSent) {
    return;
  }

  const hasImage = !!data.imageUrl;
  const hasVideo = !!data.videoUrl;

  if (hasImage === hasVideo) {
    const message = hasImage
      ? 'Choose only one media type: image or video'
      : mode === 'create'
        ? 'Upload an image or a video to create the slide'
        : 'Upload an image or a video to keep the slide valid';

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['imageUrl'],
      message,
    });

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['videoUrl'],
      message,
    });
  }
}

export const heroSlideSchema = z
  .object({
    imageUrl: optionalUrlSchema,
    videoUrl: optionalUrlSchema,
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().optional(),
    order: z.coerce.number().int().min(0, 'Order must be zero or greater'),
  })
  .superRefine((data, ctx) => requireExactlyOneMedia(data, ctx, 'create'));

export const updateHeroSlideSchema = z
  .object({
    imageUrl: optionalUrlSchema,
    videoUrl: optionalUrlSchema,
    title: z.string().trim().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    order: z.coerce.number().int().min(0, 'Order must be zero or greater').optional(),
  })
  .superRefine((data, ctx) => requireExactlyOneMedia(data, ctx, 'update'));

export type HeroSlideFormData = z.infer<typeof heroSlideSchema>;
export type HeroSlideUpdateData = z.infer<typeof updateHeroSlideSchema>;

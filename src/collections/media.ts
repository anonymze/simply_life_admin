import type { CollectionConfig } from 'payload';
import { canAccessApi } from '@/utils/helper';


export const Media: CollectionConfig = {
  slug: 'media',
  access: {
		read: ({ req: { user } }) => canAccessApi(user, ["coach", "staff", "player", "visitor"]),
		create: ({ req: { user } }) => canAccessApi(user, []),
		update: ({ req: { user } }) => canAccessApi(user, []),
		delete: ({ req: { user } }) => canAccessApi(user, []),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}

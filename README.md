# Watch Em Togetha

Share and watch movies together

## Usage
Visit [Watch Em Togetha](https://watch-em-togetha.vercel.app/):
- Create a room or Give an Existing room code to enter the room
- Let others join
- Upload video. The free tier supabase does not support upload of size more than 50MB.
- Once the video is uploaded, you can watch it together. Whenever one person in the room plays, pauses or seeks, it will automatically play, pause or seek on everyone's end

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
- ### Supabase Client
Definition in the $lib/supabaseClient.ts
- ### Routes
    -[room]<br>
        <tb>|- destroy -- 
        |
## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Environment variables

Create a `.env` file in the root. Inside:
```JavaScript
PUBLIC_SUPABASE_URL = ''
PUBLIC_SUPABASE_SECRET_KEY = ''
```
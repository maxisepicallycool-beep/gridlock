# Gridlock changelog

## 1.5.13 — Delete all cities
- "Your Cities" has a Delete all cities button. It asks you to press it a second time (or choose Keep them) so you can't wipe your cities by accident

## 1.5.12 — Bug reports, and every city is kept
- New "Report a bug" (Settings and the pause menu): describe what went wrong, optionally add technical details, and it opens a prefilled GitHub issue for you to submit (or copy the report to send in a message)
- No more numbered save slots. Every city you play is kept on record, saved automatically, and listed under "Your Cities" where you can load or delete it. Starting a new game never overwrites another city
- Your old saves are brought across as cities the first time you open this version
- Pause menu: "Save now" and "Your cities"

## 1.5.11 — Highways can join loose road ends
- A highway can now start or end on a loose road end (a dead end that isn't a driveway), including carrying straight on from it
- The rule for where a highway may meet a road is now exact: the side of a road, a loose end, a corner or junction, or another highway. The only thing refused is running straight along an ordinary through road, which would just extend it
- The Highways lesson and the how-to text explain the new options

## 1.5.10 — Darker nights on the natural map
- With "Don't apply the theme to the map" on, the grass and map now get much darker at night, but stay readable: roads, houses and lights are still easy to see

## 1.5.9 — Tiny test update
- Settings now shows which app build and game version you are running (used to check that the apps update themselves)
- Nothing else has changed

## 1.5.8 — Everything can be pushed
- The Mac and Windows apps can now update themselves from GitHub, not just the game: a newer app is downloaded, checked against its checksum and swapped in when you quit (Mac and Windows)
- The Windows app's own code updates separately and safely, and falls back to its built-in copy if a new set ever fails to start
- The songs now stay in step with the repo: new, changed or removed songs are picked up automatically
- A small toolbox (AppBridge) lets the game ask the app for things, so future features need no new app
- The app icon (including the one in Finder and on the .exe) updates with the app

## 1.5.7 — Notification timers
- New notification timers in Settings: how long a house has to be backed up before it alerts you, how long a destination stays nearly full before it warns you, how long a colour stays cut off before it alerts you, how long alerts stay on screen, and how long before the same alert can repeat
- A house that can reach every destination of its colour no longer gets a "backed up, is it connected?" alert (it is connected: that's just traffic)

## 1.5.6 — Quiet updates, green grass for the natural map
- New setting "Install updates quietly" (Settings → Updates): no update pop-ups. New versions are downloaded in the background and installed when the game opens. Experimental updates still ask first
- Green grass now belongs to the natural map ("Don't apply the theme to the map"). The themed map keeps its own beige / dark colours and follows the theme brightness slider. Both get dark at night

## 1.5.5 — Green grass
- The map's grass is now green instead of beige, at every theme brightness (greener in the dark settings too, and a pale green in High contrast)
- Trees are a deeper green so they stand out from the grass

## 1.5.4 — Theme brightness from black to white
- The brightness slider is now a real theme brightness: it slides the colours of the menus and the map from black, through dark, all the way to white (it used to just dim the screen)
- Themes are now Standard (follows the slider) and High contrast. Old Midnight/Light/Match-system settings become the matching slider position
- Text flips between light and dark at the right point so it stays readable at every brightness
- The count badges on the pieces (including the infinity sign) now always contrast with the menu, light or dark

## 1.5.3 — Highways can join highways
- A highway can now start or end on another highway, not just on a side of a road, so you can build highway networks. Cars switch between highways at the join
- A highway still can't end in the open or on the end of a road
- The coloured night glow around houses is gone (destinations keep a soft hint, and lit windows stay)

## 1.5.2 — Tutorial: you decide when to move on
- When you finish a lesson step the tutorial now waits and shows a Next button (or press Enter) instead of moving on by itself
- New fire lesson, "Construction takes time": a live countdown while the station is built, and why to build stations before you need them (20 to 70 seconds in a real game, depending on difficulty)

## 1.5.1 — The game owns the keyboard
- Keys no longer make the Mac's "can't do that" beep
- Esc opens the pause menu and no longer takes the app out of full screen
- Typing in text boxes and the Command shortcuts work as before

## 1.5.0 — A proper tutorial, brightness and a natural map option
- The tutorial is rebuilt as 8 lessons, each with its own prepared scene: first road, turning a driveway, sharing roads, junctions and stop signs, bridges, highways, fire stations with a real fire, and linking up a whole city
- A ghost road shows exactly where to build: blue for roads, green for bridges, orange for highways, plus a ghost fire station and a ring on the junction for stop signs. Roads you already built are reused
- The tutorial never warns or fails: no alerts, markers, swamp timers or game over. There is a Restart lesson button if you want a fresh scene
- Brightness slider in Settings dims or brightens everything
- The Light theme is gone (brightness covers it): themes are Dark, Midnight and High contrast. Old saved settings switch to Dark
- New setting "Don't apply the theme to the map": the map keeps its natural colours and only the menus use the theme
- Night glows toned down: destinations get a soft hint of their colour and no outline; houses keep their glow

## 1.4.0 — Tutorial, fire truck manners and colours you can see at night
- New Tutorial level (main menu): a guided town that teaches roads, rotating driveways, traffic, bridges, stop signs, highways, fire stations, layers and the weekly cards, step by step with highlights
- Fire trucks no longer shove every car off the road: only cars in the truck's way ease over to the right, let it pass, then smoothly pull back out. This also fixes cars getting stuck at the kerb afterwards
- Houses and destinations now have a base in their own colour, day and night
- At night every house, destination and car glows in its colour, and destinations get a bright coloured outline, so you can tell the colours apart in the dark
- Fixed fire stations failing to draw after the colour change

## 1.3.3 — Songs download themselves
- The songs are now on GitHub: if your copy of the game has no music files it downloads them the first time (about 11 MB) and keeps them
- Settings shows "Downloading the songs…" while that happens

## 1.3.2 — Song names
- The songs are now simply called Daytime 1, Daytime 2, Night 1 and Night 2

## 1.3.1 — New songs
- New soundtrack: two new daytime songs, plus a new nighttime song alongside Gymnopédie No. 1 by Erik Satie
- The old songs are gone
- Song titles show only when a song has an artist

## 1.3.0 — Settings, music, night and a smarter menu AI
- New Settings screen (main menu, pause menu or the Settings button): themes (Light, Dark, Midnight, High contrast, Match system), sound, notifications, controls, autosave and more
- Day and night cycle with street lamps, glowing windows, headlights and a grey-bulbed lamp that lights the road from underneath
- Soundtrack: Fi's Theme and Rito Village by day, Gymnopédie No. 1 and Dance of the Moonlight Jellies by night, crossfading as the light changes, with volume, crossfade, menu and background options
- Rebindable keyboard controls, plus zoom speed, scroll direction, pan speed and right-click options
- Notification settings: turn critical, fire, good news and warning alerts, markers and hints on or off
- Highways must now join the side of a road, never its end
- Menu AI: places fire stations that put out fires, expands the city, builds shortcuts and highways, recycles unused roads, and you can set its speed and difficulty
- New app icon, and the Dock icon can now be changed from GitHub
- Updates labelled EXPERIMENTAL are shown with a warning banner and are never installed automatically
- Faster update checks with backup addresses, cars rest at home and in parking bays, real horn sound, speed limits and parking improvements from 1.2.x

## 1.2.7 — Calmer crisis honks
- Honks near the end of a swamp or cut-off timer are about 1.8x gentler: quieter, less frantic and less frequent

## 1.2.6 — Real car horn
- Cars now honk with a real car horn recording, played quietly and sped up
- Every car has its own pitch
- Honks get louder and more frantic as a swamp or cut-off timer runs out, but never anywhere near full volume

## 1.2.5 — Update fallbacks
- If GitHub is slow, blocked or rate-limited, Gridlock tries backup addresses before giving up
- A damaged downloaded update can never replace the built-in game

## 1.2.4 — Instant update checks
- Updates now show up the moment they are published, with no waiting for GitHub's cache

## 1.2.3 — Test update 2
- Another test update to check the new fast update check
- Nothing in the game has changed
- Choose Download or Ignore to try either one

## 1.2.2 — Faster updates
- Gridlock checks for updates the moment it opens
- It also checks every 15 minutes while open, and when you switch back to it
- New updates now show up right away instead of after a few minutes

## 1.2.1 — Test update
- This is a test update to check the update prompt
- Nothing in the game has changed
- Choose Download to try the download, or Ignore to skip it

## 1.2.0 — Traffic, horns and sandbox
- Cars rest 5 seconds at home before leaving again, and 5 seconds in a parking bay before backing out
- Tiny car horns that get louder and more frantic as a swamp or cut-off timer runs out (M mutes them)
- Speed limits: long straights are fast, junctions, bends and driveways are slower; new Speed limits layer
- Cars ease between speed limits and slow down for sharp turns
- Cars reverse out of parking spots and drive forward the way they face; lots face their driveway
- Cut-off countdown starts sooner: Relaxed 35s, Standard 22.5s, Rush Hour 18s
- Sandbox editor: place houses, stores, gas stations, parking lots and fire stations, paint water and land, delete buildings, rotate destinations

## 1.1.0 — Fires and parking
- Fire stations, house fires, shutters and fire trucks
- Cars park in destination lots; every destination is a store, gas station or parking lot
- Crashes on Gridlock, growing map, swamp notifications and layer view

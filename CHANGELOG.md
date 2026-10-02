# Gridlock changelog

## 1.16.0 — A verified daily leaderboard
- No more honour system. While you play the daily level the game records a trail of checkpoints (game time, week, trips, houses, cars and the real clock every 20 seconds). When you post a score, that trail goes with it, and a GitHub Action on the repository checks it automatically: edited or typed-in numbers, trips the houses could not have delivered, weeks or game speed that don't add up, a run that wasn't played on that day, or a score posted long after it was played are all rejected with a reason. Only scores that pass appear on the leaderboard, which is now a small verified file (daily/DATE.json) that the game reads
- Scores are posted from your own GitHub account. Where the app can, it signs you in to GitHub from inside the game (a short code you confirm on github.com, with no password in the game) and posts for you; otherwise it opens the prefilled GitHub issue and you press Submit. Either way the same checks apply
- Earlier daily runs, from before this update, have no trail and can't be posted

## 1.15.0 — Time-lapse
- The game now records a time-lapse of your city: a map-style picture of the whole land every few seconds of game time (4, 8, 15 or 30, in Settings under Time-lapse; it can be turned off), independent of where your camera is. Open it from the pause menu (Time-lapse) or on the game-over screen (Watch your city grow): play it at four speeds, scrub through it, and see the week, trips and clock on every picture
- Save it as a video clip (MP4 or WebM, whichever your window can record), as the current picture, or as a contact sheet of 12 pictures through the city. Footage is kept with each saved city and goes when the city is deleted. In the Windows app files go to Downloads\Gridlock and are shown in Explorer; the Mac app needs its next build for that (until then, and in a browser, the file downloads in the usual way)

## 1.14.0 — The daily challenge and a GitHub leaderboard
- New on the main menu: Daily challenge. Every day (by UTC date) there is one level, the same for everyone: its own land (Archipelago with a moat to bridge, River country, or Lake district with about a third of the start area under water) plus two rule changes picked from Short weeks, Lean pieces, Arson, Heavy traffic, Rush hours, Reckless drivers (wrecks, with traffic coordinators) and Fragile rating. It uses the city rating, and every destination needs a road. A countdown shows when the next one arrives
- The leaderboard lives on GitHub, so it needs an internet connection (the level itself plays offline): the screen shows today's top 15 by best score. Press Post my score (also on the game-over screen) and GitHub opens a prefilled issue titled "[daily] DATE · SCORE": press Submit new issue there (it needs a GitHub account). It is an honour system. Your best score for each day is kept on your computer
- Cities started from the daily level save and load with the rules of the day they were started on

## 1.13.0 — Roundabout tool and Straight road tool
- Roundabout (key 8): click a junction and it turns into a one-way ring round the old crossing. It costs 8 one-way road pieces, the crossing roads come up and their pieces come back, and cars on them finish their trip first. The preview shows the ring and what comes up, or why it can't be built there
- Straight road (key Q): click where a road starts and where it ends (or drag it out) and the road is laid between them in one go, diagonal first and then straight. The preview shows the cost and warns about new junctions, tight angles onto an existing road, and ends that touch nothing. Esc or right-click cancels
- Both go in the dock after the pieces (not in the tutorial) and can be undone in one step

## 1.12.0 — Seasons and weather
- Four seasons for the map, in Settings under Display: Spring (fresh green, blossom trees), Summer (rich greens, bright water), Autumn (orange and gold, falling leaves) and Winter (snow-covered ground, icy water, snowy trees), next to the Halloween look that was already there. Auto goes through the four seasons, six weeks each, as the game runs. Houses, colours and everything else keep their look; the No Halloween theme switch still turns the spooky houses and colours off (and makes the Halloween season look like summer)
- Weather, for effect only, also in Settings: Auto (follows the season: rain and blossom in spring, the odd summer storm with lightning, leaves and fog in autumn, snow in winter, and green rain in the Halloween look), Off, or pick Rain, Storm, Snow, Leaves or Fog yourself, with a Weather strength slider. It comes and goes in spells, and it follows the Visual effects switch

## 1.11.0 — A City rating view
- New view in the Layers menu (and the L key), next to Fire cover: City rating. It circles on the map what is dragging your rating down: houses waiting too long (amber), cars running late (red rings on the cars), destinations backed up (purple), a colour cut off (blue crosses on its houses and rings on its destinations), buildings with no road (red, dashed) and houses on fire (orange). A panel lists each cause with what it costs per second, how many of them there are (and the share of the city), a line on what to do about it, and the recent instant hits like wrecks and burned-down houses. It only appears on difficulties that have a rating

## 1.10.1 — A city rating you can keep up in a big city
- The rating was impossible to hold in a large city: in the late game every house always has more trips waiting than its cars can carry, so "trips piling up" drained it for everyone, and the stalled-house and late-car drains counted head counts, so a bigger city was punished just for being bigger. The piling-up drain is gone, houses are now judged as "waiting too long" against how long a round trip on their own route should take, and both that and late cars are measured as a share of the city (it starts to drain above about 16%). The growth of the drain after week 4 is capped at 1.8 times (it was 2.5)
- The other drains (a colour cut off, destinations backed up, unconnected buildings, fires, wrecks) are the same, and the rating still refills when the city is calm

## 1.10.0 — City rating
- Standard, Rush Hour, Gridlock and both Realism difficulties now have a City rating (100 at the start, shown in the top bar with a bar that goes amber then red). Trouble drains it: stalled houses, cars running late, destinations backing up, a colour being cut off, buildings left unconnected for 30 seconds, trips piling up at most houses, houses on fire. Wrecks and burned-down houses knock a chunk off at once. A calm city refills it. At 0 the city is lost. Hover the rating to see what is draining it right now, and warnings tell you when it falls below 55 and below 28
- The drain grows a little after week 4, and it is harsher on Rush Hour, Gridlock and Realism Hard (gentler on Realism Easy). Relaxed, the tutorial and the sandbox have no rating. The cut-off and late-car rules still apply on top of it

## 1.9.2 — Pins that stay until you notice the building
- The pin over a new house or destination now stays until you interact with it: click the building, rest the pointer on it for a moment, or connect a road to it (a building that spawned already beside a road does not count as connected by you). The ring around it keeps pulsing while the pin is up, and saved cities remember which buildings you have seen
- A building that still has a pin but is off the screen gets an arrow on the edge of the screen in its colour; click the arrow to jump to it
- New Settings section, Locator pins: turn the pins off, choose Until I interact or a Set time (3 to 60 seconds), whether hovering counts, whether connecting a road counts, edge arrows on or off, pin size (small, normal, large), and a Mark all as seen button

## 1.9.1 — The AI's info on the main menu
- The main menu now has an AI city panel under Best runs: game time, the week and its progress, trips, cars, houses, destinations, fire stations, roads built (or wrecks on crash difficulties) and the clock on Realism, plus how many of each piece the AI has left (road, one-way road, highway, one-way highway, bridge, stop sign or traffic coordinator, fire station) and what it is doing right now. The AI plays with a limited set of pieces like a player does, so the counts go down as it builds and up as it gets cards and recycles roads
- Settings, Main menu AI: a switch to hide the panel

## 1.9.0 — Traffic coordinators, Realism, and an AI that rebuilds jams
- On Gridlock and the new Realism difficulties the stop sign piece is now a Traffic coordinator (key 5). Click the junction next to the road you want: Yield sign, Stop sign, Straight light, Left-turn light or Right-turn light (press the key again, or use the bar above the dock, to switch). Every other difficulty keeps plain stop signs
- Traffic lights run on a signal plan for each intersection: movements that never cross share a phase and left arrows get their own. Pick Signal timing and click the junction to edit it: the green time of each phase, which moves are green in it, the all-red gap, a start delay (so you can time lights along a road), and Auto plan to start over. It also shows the junction's level of service from A to F (average delay, cars a minute, queue)
- Yield signs only make you give way. Cars pulling out of a driveway or a lot now always give way, and on the crash difficulties cars only wreck at real junctions of 3 or more roads (a driveway merge cannot be signed, so it was an unavoidable crash)
- Gridlock now hands out far more signs: about 6 times as many in the starting kit and on cards, and the card comes up twice as often
- New difficulty: Realism. The card opens a menu with Easy and Hard. Both have a 24-hour clock (it starts at dawn), day and night that follow it, and morning and evening rush hours when trips swell and quiet nights when they drop away. Easy has no wrecks. Hard has wrecks (12 end it), so signal your junctions
- The menu AI places traffic lights on busy junctions in Realism, puts all-way stops at junctions where cars wreck, can pick Realism as its difficulty, and when a place keeps jamming it now tears out the roads around it and rebuilds them if the new layout is clearly better (and keeps the old one if not)

## 1.8.0 — A much smarter menu AI, and one-way highways are back
- One-way highways return as a rare piece: a new One-way highway card (a small amount, shown less often than the others), a starter piece, and hotkey 7. One-way bridges stay gone
- The menu AI was rebuilt around how a city engineer works:
  - It finds and connects houses that reach some destinations but not all of them (a bug had left them stuck with the AI doing nothing), so it survives far longer on Standard, Rush Hour and Relaxed
  - Roundabouts: a busy junction becomes a one-way square ring with the crossing roads taken up (roads come back as pieces). On Gridlock the entries get give-way signs
  - Tidying up: roads no trip needs any more are removed and recycled, now keeping every route a house might take to any destination of its colour
  - It builds many more shortcuts when it has road to spare, so trips stay short
  - It picks cards for what it needs (roads first, bridges when a river is in the way, fire stations when the city has grown), speeds up when a city is in trouble, and on Gridlock puts stop signs where cars wreck
  - The caption under the AI now says what it is doing: connecting a new house, building a roundabout, tidying up roads, adding a shortcut and so on

## 1.7.2 — Longer alerts you can set, and settings that stick
- Alerts now stay on screen for 15 seconds by default (it was 8) and the time is a slider from 3 to 60 seconds in Settings. Urgent alerts stay 2 seconds longer. If you were on the old 8 second default you move to 15
- New slider, Hints stay on screen (1 to 15 seconds, 4 by default, was 2): the small pop-ups like "No room for that here"
- Fixed: settings going back to old values after the game updated itself. The page kept the settings from when the app opened, and an in-app update loaded those again. The game now keeps a timestamp on every copy of the settings and always uses the newest

## 1.7.1 — Locators for new buildings
- Every new house and destination gets a bobbing pin above it for 3 seconds, in its own colour (split in two for dual destinations), with a ring spreading out from the building. The pin stays the same size on screen at any zoom

## 1.7.0 — Route shares
- In the Routes layer, click a road to see what share of the cars use that stretch: a percentage and how many of the current routes it is (for example 37%, 4 of 11), with a split by house colour. The road is highlighted, the label stays readable at any zoom, and the number updates as routes change. Click empty ground to clear it. In the Routes view a click inspects instead of building

## 1.6.15 — Two layer views instead of Elevation
- The Elevation layer is now two: Roads only (hides bridges, highways and the cars on them) and Bridges and highways only (fades the ground roads and outlines the elevated ones). The L key cycles through them with the others

## 1.6.14 — No more house warnings
- The "house is backed up" warning and the marker over backed-up houses are gone, along with their timer in the notification settings. Destination and cut-off warnings are unchanged

## 1.6.13 — Slightly fewer late-game roads
- Road and one-way road cards are trimmed from week 5: 10% fewer at first, growing to 30% fewer by week 15. The late-game top is now about 1.75 times a normal card instead of 2.5 times. Early weeks and other pieces are unchanged

## 1.6.12 — Ghost roads wait for cars that are on them
- A ghost road stays while a car is on it, so the car can drive off first. Cars that have not reached it yet switch to another route to the same place the moment one exists, and the ghost is removed as soon as nobody is on it (undoes the 1.6.11 change)

## 1.6.11 — Ghost roads vanish at once
- The moment another route exists, a ghost road is removed straight away, even if a car is still on it. That car just finishes the stretch it is on and carries on along the new route

## 1.6.10 — Ghost roads clear sooner
- A road you erased fades out as a ghost while cars are still on it. Now, the moment another route to the same place exists, cars switch to it and the ghost road is cleared (it used to wait for every car to drive past it). Parked cars count too: if there is a way home that does not use the ghost road, it is freed

## 1.6.9 — A real mute button
- The Sound button (and the M key) now mutes everything: horns, sound effects and music. Before, it only turned the horns off and the music kept playing. It shows Muted while it is on, and the Car horns switch in Settings still controls horns on their own

## 1.6.8 — Fog stays put
- The fog and bats now belong to the map instead of the screen, so they no longer slide or jump when you pan and zoom

## 1.6.7 — Haunted fire service
- The fire station is a gothic fire house: jagged gables, a skull plaque, a jack-o'-lantern beacon on its tower, bays with eyes watching from the dark and a cobweb in the corner
- Fire trucks are black with orange flame decals, a bone ladder, a skull on the roof and a glowing green windscreen. Their sirens flash orange and purple
- The No Halloween theme setting brings back the red station and truck

## 1.6.6 — House fire chances
- Chance of a house fire each minute: Relaxed 5% (it had none), Standard 10% (was 5%), Rush Hour 12.5% (was 10%), Gridlock 15% (unchanged)

## 1.6.5 — Graveyard tidy-up
- The graveyard's gravestones, cross and fence no longer sit on top of the parking bays; they stand in the free strips beside them

## 1.6.4 — Haunted destinations
- Stores are witch's potion shops: crooked roof, glowing windows, a bubbling cauldron
- Gas stations are potion pumps: glowing green vials under a scalloped canopy, with a little crypt for a kiosk
- Parking lots are graveyards: iron fence, gravestones, a cross, a mausoleum and a skull sign instead of the P
- Lots get a purple cobblestone floor with bone-white bays. Dual destinations split the roofs, canopies and kerb between their two colours. The No Halloween theme setting brings back the old designs

## 1.6.3 — Every destination needs a road
- On Standard, Rush Hour and Gridlock, a house now picks where its next trip is going (nearer destinations more often) whether or not a road reaches it. If there is no road, the house just waits, so you have to connect every destination of its colour. New destinations get 30 seconds before houses start picking them
- Houses stuck waiting count towards the cut-off countdown, and the menu AI now connects houses to every destination of their colour
- Relaxed and Sandbox work as before

## 1.6.2 — Losing is about the roads, not the crowd
- A destination no longer ends the game just because lots of cars are heading to it. Now it only counts cars that are running far too late (more than twice the road's clear time, plus a margin): jammed, tangled or badly connected roads
- The dots over a destination turn amber, then red, as cars run late; the warning is now "getting backed up" and the crisis is "cut off by traffic". The limit is the same number of late cars for the same time as before, per difficulty

## 1.6.1 — A spookier world
- Every colour has its own house: Pumpkin is a jack-o'-lantern, Midnight a haunted mansion, Twilight a witch's hat, Headstone a headstone with a door, Slime a dripping slime blob and Blood a vampire castle
- Haunted ground: murky purple earth, dead grass and green-black water, with gravestones, crosses and pumpkins scattered about
- Drifting fog and bats across the map (they follow Visual effects)
- New setting, No Halloween theme: brings back the original colours and houses, green trees and grass and plain menus, and turns off the fog and bats. Dual destinations stay

## 1.6.0 — Spooky season
- New icon: the spooky night city
- New colours: Pumpkin, Midnight, Twilight, Headstone, Slime and Blood. Headstone houses are little headstones with doors
- Dual destinations (from week 5): a lot split in two colours takes cars of both colours, like the one on the icon. Houses of either colour can send cars there, and it fills up with both
- Trees are now black and dead
- Cobwebs hang in the corners of menus and pop-ups
- Saved cities keep working (colours keep their place, they just look different)

## 1.5.17 — Plain colour names
- The six colours are now called Red, Blue, Yellow, Green, Purple and Orange everywhere (alerts, lessons and the sandbox)

## 1.5.16 — Report a bug on the main menu, no more one-way highways and bridges
- A Report a bug button in the top right corner of the main menu
- One-way highways and one-way bridges are gone (they served no purpose): no pieces, no cards. One-way roads stay. Saved cities that had them keep working, and any you were holding become ordinary highways and bridges
- Hotkeys now follow the pieces that remain: 1 Road, 2 One-way road, 3 Highway, 4 Bridge, 5 Stop sign, 6 Fire station (the lessons and the how-to say the right numbers)

## 1.5.15 — More road for a growing city
- Road cards now give more road as the game goes on: from week 4 they grow every week, up to two and a half times as many by the late game, on every difficulty (bridges grow a little too)
- Road cards are also a bit bigger from the start

## 1.5.14 — No more flashing menus
- Clicking things on a menu screen (difficulty cards, Delete, key bindings, Settings options) no longer replays the screen's entrance animation, so it doesn't reload or flicker
- Settings switches and option buttons now change in place instead of redrawing the whole screen, and a redraw keeps your scroll position
- The tutorial card only redraws when its text actually changes

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

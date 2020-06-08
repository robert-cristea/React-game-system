# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [alpha-unreleased-e3]

## [0.0.1] - 2018-07-03
### Changes
9b78e4f - Merge remote tokenplay/master into frontend/master, resolving conflicts from merge.

dbac355 - Create account screen: now showing the api returned error message

4611223 - ApiServer: temporary code to use the `description` field as `message` and `userMessage` when an error is returned

10034ac - Merged in revert-pr-31 (pull request #32)

5cb5d16 - Revert "Disable account creation form validation for now (pull request #31)"

367d644 - Merged in disable-acct-creation-validation (pull request #31)

0c28727 - Disable account creation form validation for now

c3ca02f - Merged in bottom-nav (pull request #30)

d3eedb9 - Temporarily hide "Shop" and "Live" tabs

1939651 - Added warning comment in Application saying it will be removed

661998f - Stream: disabled the "comments" conversation until implemented

9bf9e51 - Community: deactivated the mock "wall" and put an empty conversation for now

5048634 - Temporary support for the api special authentication error responses

4a03f0d - Conversation: bug fix: clears the list of user typing when switching conversation

89c6d64 - E3 DEMO workaround: when the user successfully buys games, they are immediately available in "Purchased games" even if the API doesn't return it.

7cb46b8 - UserGameList: wrong icon used for the "stop"

b00878c - Shop: section games can be shown in grid and platformCategories can be empty

e4e2772 - Merge branch 'master'

b95ddb0 - Conversation: to fix a bug, recreates a new socket connection every time

a2506aa - Merged in styling (pull request #29)

4ecdbfa - Add stop button for download

d57d994 - env.dev.sample.js: added 2 sample methods to test logout

6296509 - PhoenixSocket: when reopening, sets again the auth token

9967c31 - When the user is logged out, he/she is automatically redirected to the login

b538202 - MockServer: added logged in/logged out on the server

050235a - Components: user references now kept at mount to work with automatic logout

0f7cdb7 - Merged in styling (pull request #28)

b1f05bc - Brighten the bottom nav icons (inactive and active state)

fe06beb - Added warning comment in Application saying it will be removed

799ffb4 - Converstion: sending 'user:typingStopped' when leaving a conversation

af760a6 - Merged in styling (pull request #27)

38f8d62 - style download text div

82c466e - Converstion: sending 'user:entered' and 'user:exited' when mounting/demounting

817046c - ConversationSocket: renamed startTyping and stopTyping to sendStartTyping and sendStopTyping

11dea2c - Merged in styling (pull request #26)

d310c37 - Reduce font-weight for tabs title and fix download button size

f5ad991 - Login form: hitting <Enter> submits the form

e9e6acb - phoenixSocket: logging or not can be set in the config

0422fa2 - Shop: temporarily disabled sub-categories click until the server can return other category pages

04b6a96 - Home > Games: games that were already downloaded do not have the "download" button anymore

986a887 - Conversation message input: removed file upload button and added emoji functionality

c652686 - updated avatar url paths to work in electron. added real turboplay packages thought the other info is for other games.

08d65ab - Merge branch 'master' of  into feature/brwc-integration

e176e37 - fixed issue with progress bar/download text states when switch screens or tabs.

1f79695 - created a separate config for electron to avoid issue with the web build.

cd072c2 - Cart: does not allow to click "Purchase" if not enough tokens

99b36db - AppSettings: added logout

62c6a51 - AbstractServer and Authentication: added logout

0928547 - User games: showing all and downloaded games

681dfb1 - .gitignore: added tmp-build/

b4ebd23 - Merge branch 'master'

175987f - Merge branch 'master' into feature/brwc-integration

58fae5d - Merged in styling (pull request #25)

e0a39bf - Remove "cancel" label in chat app bar

c26466a - Style flash message to be a button

1e7117b - TokensBalance: reloads at each mount

1107343 - User.fill and UserRepository.fill: accepts a `forceReload`

ad49fa0 - Moved code in componentDidMount to componentWillMount where applicable

44068a2 - ProfilePreview: created a container that includes the component

1b4c613 - User token balance and game prices now BigNumber

f4c5823 - Merge branch 'master'

c89fa18 - Merged in styling (pull request #24)

0ae549a - Fix an issue when the active conversation is not highlighted in sidebar

f95c272 - Minor styling fixes and refactor

6e99d71 - Moved DownloadManager to brwc folder, add DownloadManager.dev.js as a class stub. Added a dev config for properly building the web target.

3c8bae2 - Merge branch 'master' of  into feature/brwc-integration

2292834 - updated BRWC binary. changed BrowserWindow to a bigger size.

642e3e1 - fixed paths for avatars

cde72c6 - refactored const items to separate file.

1997d66 - Merged in styling (pull request #22)

bc0ec72 - Adjust SVG height for right-side app bar

c7da8a6 - Merged in styling (pull request #21)

664c282 - Increase svg and title size on the app bar

21d5d03 - Merged in styling (pull request #20)

3cfca1c - Remove height restriction of sidebar game image so it doesn't cut off image content

117f270 - Merged in styling (pull request #19)

4836d3d - Remove dead code

a66d820 - Merged in styling (pull request #18)

fb9797b - Incorporate react-html5video into live video playback

749b466 - Merged in wording-changes (pull request #17)

cc9e631 - Change search field placeholder for store

4286417 - Conversation list: shows a message if empty

0c0328b - new conversation: always reload friends list

7f83980 - new conversation: showing a message when no friends

53c4bc0 - App sidebar menu (in home): displays the correct user and tokenBalance

f446813 - Shop: moved some gameAttributes in the config

0af23b5 - Game: update to code to use API images structure (added .url)

a81a8bd - Using formatToken() where tokens are displayed

ddd227a - utils: added formatToken

50331b4 - User: when updating, makes sure tokenBalance is a number

6815234 - Merge branch 'master'

990ad59 - Conversation: participants list (top) displays displayName, not username

5de80d5 - Friends: user (other user) profile working with the server

5621d3f - Merged in feature/youtube-embed (pull request #16)

28bf3e8 - If video is a youtube link, it will embed. Autoplay disabled across videos

d8903a1 - Move game tag up to make room for video playback controls

f65ec26 - Merged in styling-tp (pull request #15)

97eff46 - Update font weight for category titles

8d28ed6 - update Appbar styling of shopping cart and title font type

bcda02e - New wide and bold buttons

575f26a - Stying of Purchased module

2189661 - Add Roboto 500 and typography updates

e638fa9 - Merged in styling (pull request #14)

93746dc - Add more left, right padding to small button

6782159 - Merged in styling (pull request #13)

a4e6972 - Minor wording changes

07fd904 - Cart: showing loading while purchasing and added the link on "Go to my games"

ae2768e - Shop game modal: fix: the price was not displayed

c7d7161 - Friends, friend requests, user games and conversations: always reload on mount

da6794b - Loading functions clear their cache before reloading

331244e - Merge branch 'master' of  into feature/brwc-integration

07a0897 - reverted back env.js to original code.

9c1b5e9 - Updated README.md.

907a1da - Merge branch 'master'

97f4a52 - ApiServer: friends.invite didn't have the correct URL endpoint

06ac565 - Added electron-builder and electron-packager dev dependencies.

f2b9c7b - Moved electron specific code to DownloadManager. some minor fixes on showing the download text during stop.

d62186f - Added logic on when to display download text, progress bar, and icon changes. Added event callback registration in DownloadManager for UserGameList to have notifications on BRWC events. Removed the timer.

f9a6337 - added back js-cookie dependency. added ignore on dist folder

272555e - Merge branch 'master' of  into feature/brwc-integration

ddd7283 - mockData: used default profile values.

52ef16c - mockData: used default package values. Reverted env.js.

65f9dda - First BRWC integration changes. Still need cleanup and web build is not running due to electron/node specific codes.

050e0c5 - Merged in styling (pull request #12)

2144e07 - Fix start conversation button bleed

d1b2ad7 - Merge branch 'master'

ffaaa77 - ApiServer: added buyCartItems

b350e47 - Cart: now purchases items

03e5b70 - Merged in styling (pull request #11)

2e08144 - Add styling for selected users and active users in existing conversations.

4e5768c - ApiServer: fixed /conversations.get -> /conversations.delete

8cbf69a - New conversation list: added 'user-selected' class to selected user items

486fe29 - New conversation user list: added key

23401b8 - Merge branch 'master'

3d99ff4 - Merged in styling (pull request #10)

ced861a - Fix jumping issues on sign in button

52c559d - Merged in styling (pull request #9)

3456cb7 - Styling for new conversation

d0dad8a - Home > Friends: bug fix: the "sort by name" was not working and moved attributes to config

0c4c00d - Conversation: showing the user's displayName instead of username and fixed empty name in new conversation screen

e2e408d - ApiServer: implemented searchUsers()

2cf1957 - User signup no longer accepts user attributes or return the created user

e1a254d - Merged in styling (pull request #8)

d5a624d - Change label values

58c7084 - Added a "Search and invite new friends" feature in Home > Friends

186beff - Shop: the game modal window now works with data from the server (except for favorite)

d573515 - Category and CategorySection: renamed some attributes to fit the API

542ff9e - Store index: sections each have a key

c75c7c0 - Merge branch 'master'

9280e1e - config: changed the API url

4714008 - mockData: added new sample data (cart and store data)

8fcc88e - UserRepository: removed missing class

84fbb9b - phoenixSocket: setup with the authentication key

242a484 - Avatar: fallback background color

796fc03 - Conversation: erasing the message input send a typing stopped event

6d3af87 - ConversationPreview: in a multi user conversation, shows the list of users if no title

db4e392 - component Avatar: renamed function from User to Avatar

1e8fc63 - User: the cart is lazy created (only when accessed) so we don't uselessly create cart for every user

fbe4824 - ConversationSocket: modified to ignore received events that it sent

35d7f55 - ApiServer.createConversation: better support with the api for unset title

980a338 - ApiServer: added getAuthenticationKey()

678deeb - UserRepository.update: added cacheNew

1dae91a - GameRepository.update: added an explicit check for cacheNew

89989c6 - MessageEvent and UserEvent: added `is()` static method

f8cb593 - ApiServer: rejects immediately authenticated requests if not authenticated

649d843 - config: by default, do not log ApiServer errors

8eb654e - ApiServer: saves and loads auth token from cookie

df6e94d - Store front page now built from the server data

bcf0940 - Merged in styling (pull request #7)

e723308 - Profile menu styling

40dba56 - Fix top nav action dots alignment

0bf712f - Fix positioning of SVG

7bd4d94 - Merged in styling (pull request #6)

04d744a - Remove blur event on submit such that a user doesn't need to click and focus before they can type another message

af9f200 - Merged in styling (pull request #5)

4bb5761 - Add animation for user typing event

38e0b8f - Merged in styling (pull request #4)

e85c0ac - User Event styling refactor

06a049a - conversationHistory: removed some visual space at the bottom

b3044c4 - Merge branch 'master'

ca40919 - ApiServer: bug fix: was not saving the username for future authentication

2d1cb7f - Merged in styling (pull request #3)

e9193fa - Styling for game download modules

fc92da3 - Merge branch 'master'

75b7928 - Login and Create account: showing error message

cb4d11b - Merged in styling (pull request #2)

7dfe9b0 - Styling for user typing events

e3698a7 - ApiServer: added config for error logging

6c09999 - ApiServer: now checks the response's status (200-209)

3919acd - Config.get(): explicitly set `defaultValue` to `undefined`

a63ec4c - lodash/assign was changed to the correct lodash/merge

549e3fd - Merge branch 'master'

f8ba821 - Merged in dev-elvis (pull request #1)

cc914cf - shop/Index.jsx (container): removed duplicated methods

1289194 - dashboard/home/games: added "download" button to each game (still missing the final download icon)

8e9bc83 - Add styling for user event in chat module

c94c750 - Merge branch 'master'

1a60e82 - Cart: showing loading and each game item makes sure all required attributes are loaded

0fe919f - Cart: showing items from the new Cart object

84a22dd - GameItem and TokenItem: added `type` attribute

51fb666 - Renamed CartItem to AbstractCartItem

48ffa21 - utils: created generateRef() and use it in ConversationMessage

074deab - /dashboard/shop/index: tokens balance (and its add tokens) and top right cart item now working with the server cart

db13fd8 - /dashboard/shop/index: tokens balance (and its add tokens) and top right cart item now working with the server cart

ee3674b - Loading: added `size` property and a 'small' value

da6ee51 - Server add item to cart: returns the generated id of the new item

c7e3650 - Created Cart and CartItem implementations. Added to AbstractServer and MockServer

fe82289 - /dashboard/home/games: now showing tabs "All my games" and "Recently purchased"

38ed8af - UserGame: fix of `purchaseName` name and deserialization

7305346 - /dashboard/home/games: now working with new UserGame and Game returned by server

f7f5cbc - User: added loadUserGames()

e5f1bb7 - utils: update to hasAllProperties() to support paths (like 'images.cove')

42107ef - Added gameRepository service

8f25e6f - AbstractServer (and implementations): added getAllUserGames and getGames

c836703 - GameRepository, Game, UserGame: created

a1ec7a5 - /welcome/createAccount: working with UserRepository

f07ac2d - MockServer: fix for fake signup

bb4b342 - UserRepository: added signup()

3158a96 - Authentication: added setUser

184fce1 - ApiServer: added FriendRequests requests

b639f91 - ApiServer: renamed path to `/friends.getAll`

75ceaf2 - AbstractServer and ApiServer: added signup()

5acbd02 - User: added ethereumAddress

574d57b - ApiServer: update for renamed endpoints and parameter name

613443a - New conversation: we can now select multiple users to start a conversation (needs styling)

8945b3c - Added authentication to ApiServer

478b9bf - Phoenix conversation socket connector: first implementation (waiting to be tested)

5b5d777 - Conversation component: closing the socket when leaving and logs socket errors

9ef8127 - ConversationSocket and AbstractSocketConnector now emitting error events

44d3048 - Conversation: when a user event has only the user id, we load the user and then update the component

d32f7a0 - MockServer: small code update

e1d6a1f - UserRepository: added load(id, attributes)

f9732d8 - UserEvent: bug fix: was not serializing the userId if no user

9fb71a2 - README: update to add WEB BUILD

152564a - Webpack: using a new UglifyJS plugin to fix a compilation problem

4741278 - README: updated

fc42738 - Conversation: showing when other users are typing

c1e4dbc - MockConversationSocketConnector: simulates user typing

3aacded - ConversationSocket: emits a 'event' event when receiving an event

b9916a2 - Conversation: sending user:typingStarted and user:typingStopped events on the socket

71caa4c - UI: added the 'config' service in the stores

7fe4976 - MockConversationSocketConnector: added logging

866886e - env.dev.sample: added server.loggingEnabled flag

406da55 - Friends screen and friend requests now working with the repository and the server

cd025cc - MockServer: commited by mistake a reject() instead of resolve()

2fd73a1 - MockServer: added logging flag

d57948c - MockConversationSocketConnector: update to the "help" message

cd55289 - ConversationRepository: small comments update

abd171b - Friend requests: added models, repository and related config

9e05a7a - MockServer: fix to new conversation id (number -> string)

ec3d668 - Conversation: update to the AppBar to use the ConversationRepository

9d7afab - Conversation message component: now displayed in a pre to preserve line breaks

6a63c76 - Updated sample env.dev and mockData

ae6aaf7 - ApiServer: implemented

0533582 - ServerError: added error codes

77108cd - Added window.fetch() polyfill

201937a - Ids are now strings, not numbers anymore

b2946c9 - ServerError extends Error (but does not show message in log for now)

9ab9c23 - Fixed deserialization with unix time

f2ec89c - MockConversationSocket: working with user events (left, entered, joined, exited)

72536ce - Conversation: added socket, mock socket and updated conversation component to use it

1cc1bc3 - ConversationEvent: added de/serialization

cbd6e7b - Conversation screen: now loads from the server and displays the `latestEvents`

7060035 - AbstractServer: `getConversation()` now accepts a `userAttributes`

c576b6c - Conversation: added `fillUsers(attributes)`

be330c7 - ServerError: can set code, message and userMessage

b433366 - ConversationRepository: now loads a specific conversation with it events

043e70a - Messages/new: friends list now using the server and creates new conversations on the server

bb4ee21 - ConversationRepository and User: renamed some methods related to their observable array

1e9e424 - Compose new message: shows the list of friends from the server

6477669 - Conversation list: delete now works with the server

386bbf8 - ServerError: created

b37a07b - Conversations list now using the ConversationRepository

1bc2920 - MultiAvatar: now working with User instances (and not MockObject)

a61a998 - Created Conversation, ConversationRepository and methods to retrieve them

e4a3b78 - Small update to Avatar when no avatar

0d60182 - App loading screen: added basic styling

eaf871a - ProfilePreview: added the Loading component

f718f49 - components/Loading: created (a small loading spinner)

451d547 - user/ProfilePreview: loads user attributes and shows loading while waiting

4a587be - User and UserRepository: added `fill(attributes)`

8dccf73 - bug fix: UserRepository: was not saving new users properly

86c2014 - appBar/Avatar: accepts User and MockObject for now

6c14e7e - MockServer has a `delay` prop to simulate delays

06731ce - Updated avatar and home display to use the new User object

afddc56 - AppLoader: tries to reauthenticate the user when loading

cfacd35 - Added Authentication.reload (and related server functions)

e38722a - UI: showing loading screen while the application is loading

f274c8b - AppLoader: class created and 'appLoader' service added

db68c7e - Added mockData sample file to use with MockServer

681e22b - First implementation of user login with the server

8b7f499 - Bootstrap: services registering from config.services

cab78ec - Added IoC library and defined the configuration object and its service

d3dff18 - Added /etc/env.js and support in webpack for /etc/env.dev.js

ecc09ab - Replaced underscore library with more complete lodash

3373259 - Remove comments

67b877c - Different container for overflow, fix spacing

af552fd - Previews container overflow prevention

c80e845 - Snap scroll on shop and live lists

3a45473 - Merge branch 'master'

9cf11ab - Chat last message style, active style

da37dff - messages: new conversation: we can now click on the "+" beside a user name to start the conversation

12863be - App bar actions: more generic class name for the "badge" red dot

c5930e8 - messages: the current conversation is now highlighted

5ac6e0e - Merge branch 'master'

bb181c6 - shop: app bar cart icon: bug fix: the "full" class was not added

b9348ac - Credit card icons, style cart full

00f01c9 - Refactor dat placeholder, set preload attribute for performance

4bbaef4 - Update README for client running

3737331 - Merge branch 'delayed-login'

5afe95c - Custom videomplayer, unmute stream, welcome form fixes

b7030c6 - For the prototype, a fake delay when singing in/creating an account was added, to allow the browser time to render the next screen before the transition animation (in the real app, there will be a real delay when signing in).

ef0e90a - webpack: generated css now compressed

6948a62 - Merge branch 'testing/android'

9ba0232 - Add blank png to as workaround for flash of play button on kiosk browser

daa4ab0 - Merge branch 'master'

8b40610 - shop: now has a page for the categories (bottom of shop home page)

c92089c - Video posters; cleanup Avenir variants, link Avenir to styles

81dba39 - Android/Chromium fixes: form elements, video fill, button bg, couple manual pngs to jpgs

22a7b38 - mockImages: most of the png files converted to jpg

c1e2bfd - Change side modal animation to transform from positionining

aface46 - Event modal images

1bb2be6 - Gantt images, achievement images, locked achievement display

7308017 - Add mock trailer assets, and modify components to play video

eba908c - trohpies graphic + style, new message screen, prep mock data for trailers

03080b1 - Fix scroller to screen edge, update store page to user store.png

370fa40 - Template and tweak all mapped images

70d501a - Merge branch 'styling/qa-1'

6709280 - Styling fixes in response to round 1 of QA: cart, images and their aspect ratios, gradient overlays, PEGI icons, welcome screen fixes

044e379 - mock games: changed the name of Resident Evil

4b6d061 - Merge branch 'master'

705838d - /dashboard/shop/index/:game: we can now "favourite" games

6e46297 - Merge branch 'styling/external'

55ca748 - Style external profile components, messages search prompt, settings sidebar

222c79d - adding pegi

d8c74c4 - update images for games

cf5d247 - /dashboard/messages/conversation/:conversation: now redirects to messages/index when passing an invalid conversation id

361dcf1 - /dashboard/home/friends/:friend: when clicking the "send message", we are redirected to the conversation in the "Messages" section

572f441 - Cart: cannot checkout when no items, and does not show "remove" button in checkout screen

795f65a - AppBar "back" button: bigger click zone

5f68e44 - Send token modal: bug fix: when adding tokens, the button said "Send" instead of "Add"

2777d54 - ConversationPreview: the "send token" button (shown when swiping) now works

2b25764 - Global inputs, begin images, remove all tmp styles

2793749 - README: changed `yarn build` to `yarn build-web`

3445028 - GameModal (component) bug fix: confusion between game medias, and shop page medias

23fe5d6 - currentUser: bug fix: was referencing a non-existent game in the trophy list

a0c5cd7 - Added medias to mock events

901f5fd - Added medias to mock communities

75a4670 - Added medias to mock games

053e858 - /dashboard/messages/conversation: bug fix: was now able to send a message

7ca01ba - Mock users now have images Avatar (component) now showing the user image

577ba36 - Moved mock images

03ab4fe - Added mock images

bca5076 - /dashboard/messages: change of display when focussing the search input, and the "search" button in the app bar now works (by focussing the search input)

04de1ed - /dashboard/messages/new: components created

1f85402 - Search (component): now has placeholder property

70175da - UserListItem (component): className no longer required

fa2b3d9 - Created the app settings sidebar

42a7176 - External user profile is now a modal in the friends list

213403e - /dashboard/user/:user: Components created (not yet linked in Friends page)

a46eaea - README: added suggestion for running the prototype on a tablet

9bc5fa1 - Merge branch 'master'

8641b1f - Small adjustments to the animations speed

9d23c13 - Merge branch 'styling/gantt'

2a3da14 - Mockup events calendar display

bffa03b - AppTabs: fixed bug where the tab would not highlight when in its section

f4a8fa0 - Merge branch 'master'

2f67c32 - Some instructions on how to test the Electron app

67eb902 - Removed some old 'full screen' code not needed anymore

f29ed80 - Bug fix: sometimes some "slide over" animations (like to /welcome) was showing a flash of the previous screen

9c3e786 - Merge branch 'master'

284731f - Style trophy modal, progress bar spacing, add currency to profile

84d4ecc - Icon (component) (the last version was overwritten) can now again be clicked

3c4ea27 - Review of the screen animations to fix some bugs and make it more flexible

d1f0b72 - Bug fix: in Electron, a white flash appeared after the login. The reason was that there was a form in the page and when submitting it, in Chrome, it would change the URL by appending a '?' after the URL, so it would reload the app. The solution was to remove the form since we don't need it (but we could also add a `preventDefault()` on the form).

f198065 - Group: now works with a `null` animation. Also updated the Transitioner to correctly work with a `null` animation

55124ba - dashboard/live: the "send tokens" button now works

449a172 - Merge branch 'master'

23c635c - dashboard/live: the stream screen is now a modal. Allowed the 'full screen' logic to be only inside the modal, so it simplified it

4e678f3 - Revise progress bar to use semantic element; begin trophy page style

b13172a - Merge branch 'master'

36918d7 - Style events page

a3097ba - home/trophies: components created

6584e20 - home/events: event modal components created

6d2a1d7 - home/events: components created (panel modal for specific event not yet created)

2f62a11 - home/Friends (container): small code cleanup

adaf26e - home/acivities: added scrolling

6d73401 - home/friends: flash message moved inside the right column, so we could simplify the whole "flash message" thing

98e425e - Finish title refactor

0efcce5 - Style community modal; refactor circle icon + title combo for stylistic maintainability

22ecb6e - Style community pages

24476ac - Fix for flashMessage key error

631ab19 - Style friends pages

f009388 - Style home activities

f013708 - Merge branch 'style/flyout-and-homegame'

4511421 - Style message actions and game on homepage

2c1c137 - README.md: BitBucket doesn't understand numeral list with 1) ??

898ead8 - Merge branch 'master'

3ae98a4 - Added documentation on how to build the Electron app

5efd57b - Added electron build script and code

4f761e8 - Remove tmpStyles no longer in use, flex-container global

77a5450 - Style add token modal and checkout

c49fda6 - Style shop cart

f2f752c - /dashboard/home/communities: components created

578f546 - Icon (component): can now be clicked

da5a3bc - Merge branch 'master'

e7d1e68 - /dashboard/home/friends: added pending friend requests "flash" message and side modal

c8f15f0 - Style shop game page; add turboplay icon and logo; reconfig svg loading to url loader

4d2c4f7 - /dashboard/home/friends: screen and components created

4731c0c - /dashboard/home/activities: components created

9f8fb87 - /dashboard/home/games: side modal and components created

5422c44 - Merge branch 'master'

fa7a2d1 - Created the "send tokens" modal and added to the shop pages

816f2ad - Style shop index

5f46d29 - Cart modal: components created and added to the Shop screen

a592ead - appBar/Actions: single action can now have a className

9863aa8 - /dashboard/shop/index/:gameId (game modal): components created (missing handling function for add to cart)

9d8f98f - modal css: added flex display

32e9c84 - Added numeral library

6b5b194 - Sidebar (component): can now receive className and style props

90339f8 - /dashboard/shop/index: now shows the game modal when clicking on a game (modal content not yet created)

e5ee5aa - appBar/Actions (component): simplification of how the icon is set

24688ae - stream/StreamMeta (component): className now optional

9b7a4ba - Dashboard: now has 2 different locations for modals (since we will need to show 2 different)

ae438e8 - Stream: cleaner code for the workaround of react-modal with react-hot-loader

21a321e - UI: modalLocation is now observable, since the code can be ready to add the modal BEFORE the modalLocation is created. By being observable, the code can wait until the location is defined

e1d4232 - Installed new react-hot-loader

cc809ad - /dashboard/shop/index: components created and ready for styling

1a97c25 - AppBar (component): can now accept anything renderable as 'title', even a React element

898ea07 - ScrollableView: re-added style prop (even if now used only for temp. styling, it can be required eventually)

f702240 - Style rules in webpack prod config

d8c3b13 - Viewers modal grid

8da3fe0 - Live and live modals styling, markup cleanup

d51fbc1 - Reduce live component markup; move styles to SCSS and adjust

dbdfbf9 - Merge branch 'master'

145c023 - home/games/index: added ScrollableView

c8693be - Merge stashed live changes to incoming master changes

2968f91 - Merge branch 'master'

a2301d5 - live/stream/id: now has a 'back' button in the app bar

b4da0ad - live/stream/id: can now be full screen

e3430bb - live/stream/id: 'View Comments' button and modal now working

a684157 - converstations/MessageInput (component): submits the message when pressing 'Enter'

44c2290 - Merge branch 'master' into styling/nav

2f7202e - PanelModal created dashboard/live/stream/id: layout components created (not finished), with the "show viewers" modal

3cb2476 - appBar/Back (component): now has an arrow that can be displayed

40849f1 - UI: added methods to register and get modal locations

eb4e39d - Added react-modal

77a19b9 - Bumped React version (from 16.0 to 16.2)

5d159d4 - Nav, messages, and app page styling

731fb21 - Nav icons, backgrounds, message styling

7677e0e - components/game/* related to streaming moved to stream/ folder

ff2d8c1 - live/index: component structure created

138ea22 - ScrollableView (component): created a component for scrollable content working even in flex display

c533d98 - Merge branch 'styling/nav'

c1fed12 - Nav styling, webpack tweaks for SVG, app page bgs, messages styling

146724e - Merge branch 'master'

71831a7 - Revise icon implementation to be React components w/ supplied path data

f1fad1f - Icon (component): created with a temporary implementation

fc5fa8a - Merge branch 'styling/nav'

77b39e6 - Rough working SVG icon load implementation

cd63fd8 - /dashboard/home/games: components created to show the game list

cb2ff57 - mock: randomConversation: missing comma

3efe492 - Sidebar (component): added bg color to hide elements going under

b9db00c - mock: separated currentUser from the list of sample users and added sample games

fce1754 - mock: added another sample conversation

3aac3aa - (components): created the 'navigation' folder and moved in AppTab(s) and SectionTab(s)

61b9729 - Avatar and MultiAvatar (components): moved to 'user' folder

d13d646 - Sidebar (component): fix to also accept array of elements as children

3e6fc8e - Created component user/ProfilePreview and added to Home group

f51850d - app.scss: removed '/' before node module import

f1033f4 - Added a Sidebar component

f76383e - README: small change to use yarn instead of npm

d806ff4 - Merge branch 'master'

8e5398b - DiscussionList: added "swipeout" actions and we can now delete discussions

a6c33a7 - README.md edited online with Bitbucket

edabab6 - Messages: app bar now has dynamic title and actions based on the current message screen

7b464dd - Added generic "Back" button for the app bar

43b6675 - Router: added goBack() and switch() methods

a5cf6a5 - animatedRouteGroup: when a group has a component we pass it down props

aeba585 - Merge branch 'styling/app-pages'

e65337f - Font setup, correct form element layout

5fff160 - The "conversation" term is now used instead of "discussion"

5124ebf - Message discussion: now interactive: we can send a message and it is added to the current discussion

b120f53 - eslint: added instance variables in component methods order

531debf - create account: added form components

2d30454 - Organize SCSS; add sparse reset; remove file-by-file-import; most of login page style

1f1efc1 - Prettier to tabs

dd757ae - Created temporary 'shop' and 'live' index screens

a9ea67f - All sass files must start with an underscore

1df5a31 - First integration of a discussion screen

37a9063 - MultiAvatar: added missing key

7a58f10 - /dashboard/messages/index: created

dcb99a0 - Messages: first integration with discussions sidebar

5b8d017 - New Avatar component since we will need it at different places

bff611f - AppBar: simplified and added more flexibility with the 'post' actions

ac63cbc - SectionTabs: first integration and added to Home

3fc7482 - SASS .screenGroupDashboard: small fix to class name

97cb374 - Creation of the "Home" group with AppBar

6c9a983 - AppBar first integration

4db17c9 - First integration of the Dashboard route group and its AppTabs

c677b61 - Fix: index.web.js was not referencing the new path of App.jsx

099f191 - Router#matchesPath implemented

30baf93 - Moved App.jsx to containers

f7e9d8e - Implemented Application, UI and Router classes (added mobx, mobx-react, mobx-react-router)

1948bae - eslint: allow "react/sort-comp" errors

dfd3d9b - Moved higherOverFromSide animation to its own sass file (removed from index.html)

aa1d170 - /welcome/{login,createAccount}: first integration of general structure and design of thoses pages

b27916b - Now using HashRouter with react-router instead of MemoryRouter

1b594b8 - Added sass, using babel-preset-env and moved all js source files to src/js/

75a28b9 - Adapted to React web only + routing animations

f04ea4d - README.md edited online with Bitbucket

a3706c4 - Eject from create-react-native-app; build out webpack config now that it is ejected, including selective bundling of .web.extension components; restructure project directory

cafe409 - Router navigation test/demo

84c27ce - Electron config

e0f29cb - Remove ediotr config file

806df8a - Update .gitignore

64204e4 - Init
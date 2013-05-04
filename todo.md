- create buttons for the text inputs and create button style for the site
- pick a set of colors from kuler, thinking the green as base color
- set up database (mongodb for now but hopefully riak if this app gets going) and create data layer
- create API
- create navigation icon buttons to place in header
- have one button for create new story - go to new page
- have main page show only previews of latest stories, with some stats/info on hover

- create locking feature - when someone starts typing in a textarea and no-one else has a lock they gain the lock on the
current story so that no one else can add their paragraph while they have the lock. they will lose the lock either once
they add their text to the story or once they have stopped writing for a certain time (debounce the unlock) or after a certain
max time
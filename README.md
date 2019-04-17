# CS252_FinalProject
Final Project For CS 252

Uses Express, socket.io, and p5.js

This game is inspired by the <a href="https://www.reddit.com/r/gameideas/comments/be3gzn/feedinfect/">reddit post</a> by reddit user<a href="https://www.reddit.com/user/mr-android-">u/mr-android</a>

## The Idea
In this game one player starts as a zombie.
The rest of the players are survivors fighting the zombie invasion

In order for the zombie to win, all players must become zombies
If all the zombies are eliminated, the players win.
If the zombie player is killed, but there is still other zombies alive, the player will gain control of a random zombie left alive. 


The land is filled with 'neturals' who are NPC's that wonder around at random. 

For a person to become a zombie, they must come in contact with a zombie. 
If a player is touched by a zombie, they switch to the zombie team and try to convert the remaing survivors
Only players that are still survivors at the end of a game recieve a win.
If the OG zombie player converts all survivors, they gain a victory in the zombie catorgory, compared to that of a survivor victory. 
const Discord = require('discord.js')
const Filter = require('bad-words')
const path = require('path')
const fs = require('fs')

const client = new Discord.Client();  
const bad_words = new Filter({ placeHolder: 'x'})

const not_bad_path = path.join(__dirname, 'not-bad.txt')
const more_bad_path = path.join(__dirname, 'more-bad.txt')

// make arrays of our lists of bad words
const not_bad = fs.readFileSync(not_bad_path, 'utf-8').split(/\r?\n|\r/)
const more_bad = fs.readFileSync(more_bad_path, 'utf-8').split(/\r?\n|\r/)

// some of these aren't too bad
bad_words.removeWords(...not_bad)
// add some words that are that bad
bad_words.addWords(...more_bad)

client.on('ready', () => {   
    console.log(`Logged in as ${client.user.tag}!`)
});

// when users send a message
client.on('message', msg => {  
    cleanMessage()
})

// when users edit a posted message (some were abusing this to bypass filter)
client.on('edit', msg => {
    cleanMessage()
})

function cleanMessage(msg) {
    if(msg.author.bot) return

    if (bad_words.isProfane(msg.content)) {   
        // remove message or edit message to have censors
        msg.delete()
            .then(msg => msg.reply(`Please be more considerate with your language.
We are trying to keep the server a nice place for everyone! :herb:
Your deleted message: ${(bad_words.clean(msg.content))}`))
            .catch(err => msg.reply(`help me........ ${err}`))
    } 
}

client.login(process.env.TOKEN)
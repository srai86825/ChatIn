export const prompts = {
  wouldYouRather: `I am bored. You are supposed to ask a would you rather question to me. But you have to take care of somethings while asking me
  you must not say anything except the question and options. the question is always followed by options, you can not use new line(by backslash-n).
  you must NEVER write a options which is written in new line. AND YOU MUST NOT BREAK any of the rule below at any conditions
  question genres: edgy,romantic,funny,dark-humour,annoying
  At ALL Conditions, you have to write in the same line. You have to think out of the box. ANDDD ou must NOT write anything except what i asked you for, this is not allowed ex:'Here's a icebreaker for you:..','Okay, here you go..' 
  Rules: 
  i).exactly there can be 3 options.
  ii).You MUST NOT start numnering the options ex: Option 1,1, 1, etc.. ie THE OPTIONS MUST NOT be numbered.
  iii). you must not specify any formatting characters(ex: for bold,italic,etc) except new-line 
  iv).YOU MUST PROVIDE ONLY ONE QUESTION
  v). You MUST use ONLY '#' character to denote new line. no backslash-n
 vi). try to keep options as short as possible without making 
 vii)The MOST IMPORTANT RULE, the questions, and options should be writting in same line. no new lines. But ALl the options and questions should be seperated by '#' character.
 viii). ALWAYS FIRSTLY YOU have to ask the question and then follow # with option,then # and then new option,...
 ix). You must NOT write anything except what i asked you for, this is not allowed ex:'Here's a question for you:..','Okay, here you go..' 
 example output format Question#Option1#Option2#Option3
 example o/p1:what do you prefer more?#Pizza#Burger#Coke
 example o/p2:would you rather?#eat a spider#Never eat chocolate again#Always have a spider crawling on you#Have a spider for a pet
 example o/p2:what would you prefer?#Getting married after turning 35#Only be able to have sex once a month#Have to cheat your current partner#have sex with opposite gender of your interest`,
  iceBreaker: `
 I and my friend are bored. You are supposed to give me few icebreakers to me. But you have to take care of somethings while asking me,
  you must not say anything except the icebreakers. you can not use new line(by backslash-n).
  you must NEVER write a icebreaker which is written in new line. AND YOU MUST NOT BREAK any of the rule below at any conditions
  icebreaker types: questions(edgy,romantic,funny,dark-humour,annoying), small games which could be played in chatting,etc.
  

  At ALL Conditions, you have to write in the same line. You have to think out of the box. ANDDD ou must NOT write anything except what i asked you for, this is not allowed ex:'Here's a icebreaker for you:..','Okay, here you go..' 
  Rules: 
  i).minimum there can be 3 icebreakers. and maximum of 5.
  ii).You MUST NOT start numnering the icebreakers. ex: Icebreakers 1,1, 1, etc.. ie THE icebreakers MUST NOT be numbered.
  iii). you must not specify any formatting characters(ex: for bold,italic,etc) except new-line 
  iv).YOU MUST PROVIDE ONLY ONE QUESTION
  v). You MUST use ONLY '#' character to denote new line. no backslash-n
 vi). try to keep icebreakers as short as possible
 vii)The MOST IMPORTANT RULE, the questions, and icebreakers should be written in same line. no new lines. ALl the icebreakers should be seperated by '#' character.
 viii). ALWAYS Ask Icebreaker followed # then another icebreker,then # and then new icebreaker,...
 example output format IcebreakerQuestion#IcebreakerChatGame#IcebreakerChatGame,..
 example o/p1:what should be the maximum age to get married for a guy?#Two Truths and a lie#Wrong answers only#Build a Story#...
 example o/p2:when you made your first BFF?#If you are hungry and only can ask someone who lives atleast 30minutes aways to bring food on call, who are you asking?#Wrong answers only#Write a story about the man/women of your dream#...
 
 `,
};

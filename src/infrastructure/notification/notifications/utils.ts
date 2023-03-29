export const mentionsRegex = /@\[(?<name>[\w \u00C0-\u00FF-]+)]\((?<id>[\da-f-]+)\)/g

export const cleanComment = (comment: string) => {
  return comment.replace(mentionsRegex, '$1')
}

export const isTagged = (comment: string) => {
  return /@\[([\w \u00C0-\u00FF-]+)]\(([\da-f-]+)\)/.test(comment)
}

export const getMentionedUserIdsFromComments = (comment: string) => {
  const mentions = [...comment.matchAll(mentionsRegex)]
  const usersIds = mentions.map((mention) => mention.groups.id)
  return usersIds
}

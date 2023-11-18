import { v } from "convex/values"
import { QueryCtx, mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

const getUserId = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Not Authenticated")
  return identity.subject
}
const getExistingDoc = async (
  ctx: QueryCtx,
  args: { id: Id<"documents"> },
  userId: string,
) => {
  const existingDocument = await ctx.db.get(args.id)
  if (!existingDocument) throw new Error("Not found")
  if (existingDocument.userId !== userId) throw new Error("Unauthorized")
  return existingDocument
}

export const getFavorites = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isFavorite"), true))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect()
    return documents
  },
})

export const removeCoverImage = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    getExistingDoc(ctx, args, userId)
    const document = await ctx.db.patch(args.id, { coverImage: undefined })
    return document
  },
})
export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    getExistingDoc(ctx, args, userId)
    const document = await ctx.db.patch(args.id, { icon: undefined })
    return document
  },
})

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    isFavorite: v.optional(v.boolean()),
    editTimestamp: v.optional(v.number()),
    isLocked:v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args //we update rest info, but not id
    //here , we partitioned args in two data, one is id , others[title,icon,..] in rest args
    const userId = await getUserId(ctx)
    getExistingDoc(ctx, args, userId)
    const document = await ctx.db.patch(args.id, { ...rest })
    return document
  },
})

export const getById = query({
  args: { documentId: v.id("documents") },
  //logic for accessing post Publically
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const document = await ctx.db.get(args.documentId)
    if (!document) throw new Error("Not found")
    if (document.isPublished && !document.isArchived) return document
    //for post admin
    if (!identity) throw new Error("Not Authenticated")
    const userId = identity.subject
    if (document.userId !== userId) throw new Error("Unauthorized")
    return document
  },
})

export const getSearch = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect()
    return documents
  },
})

export const getTrash = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect()
    return documents
  },
})
export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    const existingDocument = await getExistingDoc(ctx, args, userId)

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        })
        await recursiveRestore(child._id)
      }
    }

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    } //options to be updated in existing doc

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument)
      if (parent?.isArchived) options.parentDocument = undefined //if parent has isArchived = true then make its parentDoc undefined
    }
    const doc = await ctx.db.patch(args.id, options) //update the existingDoc with new options(isArchived = false, parentDoc =undefined)

    recursiveRestore(args.id)
    return doc
  },
})
export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    getExistingDoc(ctx, args, userId)
    const document = await ctx.db.delete(args.id)
    return document
  },
})
export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    getExistingDoc(ctx, args, userId)
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
          isFavorite: false,
        })
        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
      isFavorite: false,
    })

    recursiveArchive(args.id)
    return document
  },
})
/* function to get files for sidebar */
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const userId =
      await getUserId(
        ctx,
      ) /* fetch docs indexed by user_parent(userid == parentDoc) aslo filter those which are not archieved */
    const documents = await ctx.db
      .query("documents")
      .withIndex(
        "by_user_parent",
        (q) =>
          q
            .eq("userId", userId)
            .eq(
              "parentDocument",
              args.parentDocument,
            ) /* parentDoc is optional (used in case of children note) */,
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect()
    return documents
  },
})

export const create = mutation({
  //create new instance in document db
  args: {
    //args required while calling create fn
    title: v.string(),
    parentDocument: v.optional(v.id("documents")), //required when we create a sub doc(doc inside another doc)
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    //ctx - context, args - arguments
    const userId = await getUserId(ctx)
    //to create a new doc instance in db
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      content: args.content,
      coverImage: args.coverImage,
      icon: args.icon,
      userId: userId, //got userId from ctx.auth.getUserIdentity()
      isArchived: false, //by default values
      isPublished: false,
      isFavorite: false,
      editTimestamp: 0,
      isLocked:false
    })
    return document
  },
})

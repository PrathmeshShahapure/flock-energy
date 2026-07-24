# PROTOCOL

## Reverse Engineering Notes

## Overview

The goal of this assignment was to build a clean REST API on top of the existing **Urja Meter Ops** portal. The portal already works well for humans because they can log in through the browser, search for meters, and view their details. The challenge was to understand how the portal communicates with its backend and expose the same data through a clean API that another application could consume without interacting with the original website.

This document describes how I investigated the portal, what I discovered, the problems I faced, and the decisions I made while building the adapter service.

---

# How I Started

When I first read the assignment, I was a little confused because I had never worked on a reverse engineering task like this before. Initially, I wasn't sure whether I was expected to build completely new APIs or somehow reuse the existing portal.

Instead of writing code immediately, I opened the portal in Chrome, logged in using the provided credentials, and started observing how it behaved.

From the beginning, my goal was not to guess how the portal worked. I wanted to observe everything first and then implement it. Throughout the investigation I mainly relied on **Chrome DevTools**, especially the **Network** and **Application** tabs.

The Network tab helped me inspect every request and response made by the portal, while the Application tab helped me understand authentication and session management.

At this stage I wasn't trying to build anything. I was simply trying to understand how the portal communicated with its backend.

---

# Authentication

The first request I investigated was the login request.

While signing in, I observed a **POST /login** request.

A few things immediately stood out:

- The request body was sent as `application/x-www-form-urlencoded` instead of JSON.
- After a successful login, the server responded with **303 See Other** and redirected the browser to the `/meters` page.
- A session cookie named `__Secure-better-auth.session_token` was created and used for all subsequent authenticated requests.

When I implemented login from my own backend, it did not work immediately.

Initially, I received **415 Unsupported Media Type** because I was sending JSON instead of `application/x-www-form-urlencoded`.

After fixing that issue, I started receiving **403 Forbidden** with a message indicating that cross-site form submissions were not allowed.

At first I thought I had implemented authentication incorrectly, but after comparing my request with the browser request, I realized that the portal expected the same headers sent by the frontend. The important ones were:

- `Origin`
- `Referer`
- `x-sveltekit-action`

After reproducing the browser request and preserving the session cookie using a CookieJar, authentication worked successfully. From that point onward the same authenticated client could be reused for all remaining requests.

Looking back, I am happy that I prioritized automating the login first because without solving authentication, none of the remaining endpoints would have been accessible.

---

# Discovering the Portal Endpoints

Once login succeeded, the portal redirected me to the meters page.

Again I opened the Network tab and observed all requests made by the application.

There were many JavaScript and CSS files, but I ignored those because they were frontend assets. Instead, I focused only on requests that returned application data.

The first useful endpoint I found was:

GET /portal/meters/search?q=&page=1

This endpoint returned a clean paginated JSON response containing:

- Meter list
- Current page
- Page size
- Total number of meters

I also noticed that the endpoint accepted a search query, allowing meters to be searched by meter ID.

Clicking on a meter opened the details page.

This page triggered three additional requests:

- GET /meters/{id}/__data.json
- GET /portal/meters/{id}/geo
- GET /portal/meters/{id}/energy

The `geo` endpoint returned latitude and longitude in a simple JSON response.

The `energy` endpoint returned historical energy readings and was also straightforward to understand.

The most challenging endpoint was `__data.json`.

Unlike the other endpoints, its response was not immediately human-readable and required additional investigation before it could be used.

---

# Meter Detail Serialization

The meter detail endpoint turned out to be the most interesting part of the investigation.

Initially, I assumed every meter returned the same response format.

Based on the first few responses I inspected, I implemented a parser that extracted meter information successfully.

Later, while refactoring the project and testing additional meters, I discovered that not every meter returned the same structure.

I found two different serialization formats for the same endpoint.

### Format 1

Some meters returned a JSON string containing the complete installed meter object.

This response could simply be parsed using `JSON.parse()`.

### Format 2

Other meters returned a reference-based structure where values were stored as indexes pointing to other elements in the response array.

Instead of returning two different response formats from my own API, I updated the parser to detect which format had been returned and normalize both into the same response object.

This allowed clients of my API to receive a consistent response regardless of how the legacy portal represented the underlying data.

This was probably the most interesting discovery I made during the investigation.

---

# Transformer Endpoint

The transformer page followed a much simpler pattern compared to the meter details page.

The endpoint:

GET /portal/dts?page=1

returned a paginated JSON response containing transformer information including:

- Transformer code
- Name
- Feeder code
- Capacity

Since the response was already clean, no additional parsing logic was required.

---

# Interesting Findings

A few things surprised me during this investigation.

The biggest one was discovering that the meter detail endpoint did not always return the same response format. I initially believed there was only one serialization format and only discovered the second format while refactoring and testing additional meters.

Another interesting observation was how strict the authentication flow was. Even after providing valid credentials, my backend could not authenticate until I reproduced the same request structure as the browser, including the expected headers.

Those two discoveries took the most time but also taught me the most about how the portal worked.

---

# Challenges

The biggest technical challenge was authentication.

I spent a considerable amount of time debugging the login request because I initially received **415 Unsupported Media Type**, followed by **403 Forbidden**.

The second major challenge was parsing the meter details endpoint.

My first parser worked correctly for some meters but later failed when I discovered the second serialization format.

Instead of hardcoding a solution for individual meters, I redesigned the parser to detect the response format dynamically and normalize both formats into a consistent object.

That approach made the API much more reliable.

---

# Assumptions

While working on this assignment, I tried not to make assumptions whenever possible.

My approach was to first observe the actual network requests and responses before implementing anything.

One assumption I did make was believing that every meter detail response used the same serialization format.

Later I discovered that assumption was incorrect and updated the parser accordingly.

For the adapter itself, I assumed:

- The portal should be treated as read-only.
- Authentication credentials remain valid during the session.
- Existing portal endpoints continue to behave consistently.

---

# Summary

By the end of this investigation I had a much better understanding of how the Urja Meter Ops portal communicates with its backend.

Using that understanding, I built a clean REST API that hides the complexity of the legacy portal behind simple and consistent endpoints.

Although I was running out of time toward the end of the assignment, this was honestly one of the most enjoyable parts of the project. I had never reverse engineered an application like this before, and watching everything gradually make sense—from authentication to endpoint discovery to handling two different serialization formats—made the whole experience both challenging and fun.
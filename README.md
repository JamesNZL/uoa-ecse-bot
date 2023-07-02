<div align="center">
   <img src="assets/ECSE.png" width="25%">
</div>

# `UoA ECSE` Onboarding Bot

<br>

<div align="center">
  <a href="https://discord.gg/k2jjmmVPeK">
     <img src="https://discordapp.com/api/guilds/908944607344214106/widget.png?style=banner2" alt="Discord Server"/>
  </a>
</div>

<br>

A basic, single-concern Discord bot to handle onboarding for [UoA ECSE](https://discord.gg/V8A7V4FtS7).

- [Purpose](#purpose)
- [Terminology](#terminology)
  - [Roles](#roles)
  - [Channels](#channels)
  - [Members](#members)
  - [Other](#other)
- [Onboarding](#onboarding)
- [`uoa-ecse-bot`](#uoa-ecse-bot)
- [Permissions Doctrine](#permissions-doctrine)
- [Course Forum Channels](#course-forum-channels)
- [Licence](#licence)

# Purpose
> These docs may be very verbose and intimidating (:sweat_smile:), but I hope that they are detailed enough to be useful.

The purpose of this documentation is to *encourage* and *enable* future student reps/administrators/maintainers to **confidently** make changes to this server, with the aim that they:
  - are informed about the specificities of previous configuration(s),
  - know what might break, and
  - can make changes *without* things breaking.

# Terminology

### Roles
- `Required` roles—`Specialisation` and `Part` roles, each of which every member has **exactly one**.
- `Vanity` roles—`@purple`, `@blue`, `@green`, ..., `@he/him`, `@she/her`, ...
---
- `Specialisation` roles—`@Electrical & Electronic`, `@Computer Systems`, `@Software`.
- `Part` roles—`@Part I`, `@Part II`, `@Part III`, `@Part IV`.
---
- `Non ECSE` role—`@Non-ECSE`.
- `Other Part` role—`@Other Part`.

### Channels
- `Default` channel—any channel that is visible to `@everyone` by default.
- `Opt-in` channel—any channel that is visible to `@everyone` through `#Browse Channels`.
- `Private` channel—any channel that is role-restricted.
---
- `Specialisation` channels—`#eee`, `#cse`, `#swe`.
  - These are `Opt-in` channels for `@everyone` to talk about anything related to each specialisation.
- `Part` channels—`#part-i`, `#part-ii`, `#part-iii`, `#part-iv`.
  - These are `Opt-in` channels for `@everyone` to talk about anything related to each part.
- `Cohort` channels—the channels including `#eee-ii`, `#cse-iv` and `#swe-iii`.
  - These are `Private` **cohort-specific** channels that are intended to allow `@Student Rep`s to `@everyone` to **only** their cohort, and no one else.

### Members
- `Onboarding` member—someone with the `@Onboarding` role.
- `Onboarded` member—someone without the `@Onboarding` role.
---
- `Administrator`—any member with the `ADMINISTRATOR` permission.

### Other
- `False pings`—when a `@Student Rep` tries to `@everyone` their cohort, but pings more people than necessary.
  - This does not include members who just have an outdated `Part` role—that is not a failure of the server setup and can be disregarded.

# Onboarding

- This server uses Discord's built-in **Onboarding** feature.
- `Onboarding` members are prompted to select their `Specialisation` and `Part` as *pre-join* questions.
  - This means that *all* `Onboarded` members are *guaranteed* to have **exactly one** `Specialisation` and `Part`.
- Members can change their `Specialisation`, `Part`, and `Vanity` roles at any time in `Customise Community`, but they *cannot unset* any `Required` roles.
  - This is important, as any member without a `Specialisation` or `Part` role will see too many/too little `Cohort` channels, and receive `False pings`.
  - The reason for these `False pings` occurring is covered below in [**Permissions Doctrine**](#permissions-doctrine).
- This onboarding process also assigns each member their desired `Opt-in` channels.

# `uoa-ecse-bot`

> **Note**  
> Source code is available in this repository (https://jamesnzl.xyz/uoa-ecse-bot).
> 
> My production server will automatically `git pull` and re-deploy whenever the repository is pushed to, so future contributions/maintenance is easy & welcomed.

- Assigns the `@Onboarding` role to all new members when they join the server.
- Handles the button interaction in `#✅-onboarding`, by:
  1. Ensuring the member has exactly one `Specialisation` and `Part`, or are a `Non-ECSE` student.
    - If the member has an ECSE `Specialisation` but has selected `Other Part`, they will fail to onboard.
    - Note that a member *may* select a valid `Part` to pass onboarding, *then* select `Other Part` in `Customise Community` *afterwards*—this will simply mean that they are unable to view any `Cohort` channels, similar to a `Non-ECSE` student.
 2. Removing the `@Onboarding` role from the (now `Onboarded`) member.
- If the onboarding button interaction message is deleted from `#✅-onboarding`, any `Administrator` can replace it by running the `/setup` slash command.

# Permissions Doctrine
> **Note**  
> Reference: [*How is the permission hierarchy structured?*](https://support.discord.com/hc/en-us/articles/206141927-How-is-the-permission-hierarchy-structured-)

- As Discord's channel permissions hierarchy applies all `DENY` rules before applying all `ALLOW` rules, we are forced to have a *fail-last* permissions hierarchy for our `Private` `Cohort` channels:
  - We cannot do something like this (eg for `#cse-iii`):
    1. :x: `DENY @everyone`
    2. :white_check_mark: `ALLOW @Part III`
    3. :x: `DENY @Electrical and Electronic`
    4. :x: `DENY @Software`
    5. :x: `DENY @Non-ECSE`
  - We must instead do this:
    1. :white_check_mark: `ALLOW @everyone`
    2. :x: `DENY @Part I`
    3. :x: `DENY @Part II`
    4. :x: `DENY @Part IV`
    5. :x: `DENY @Postgrad`
    6. :x: `DENY @Other Part`
    7. :x: `DENY @Electrical and Electronic`
    8. :x: `DENY @Software`
    9. :x: `DENY @Non-ECSE`
- This is why it is *essential* that all members have the `Required` roles (ie both a `Specialisation` and `Part`, or `Non-ECSE`), as this is what is used to ensure:
  - Current ECSE students will see **exactly one** `Cohort` channel (ie theirs), and
  - `Non-ECSE` members will see **exactly zero** `Cohort` channels.
- If a member has *more than one* `Specialisation` and/or `Part`, the union of `DENY` rules will mean that they cannot see **any** `Cohort` channels.

# Course Forum Channels

- Each Part/semester has its own **Forum Channel**, eg `#pii-sem2`, `#piii-sem1`, and `#piv-sem2`.
- These are `Default` channels to promote discovery.
- Each course within that semester is created as a **Forum Post** within the appropriate forum.
- These are `Opt-in` channels that members can add to their sidebar by right-clicking on the post and selecting `Follow Post`.
- These course channels can be used by `@Student Rep`s to `@everyone` to **only** the members that **follow** that course channel, and no one else.

# Licence

The source code in this repository is licensed under MIT.

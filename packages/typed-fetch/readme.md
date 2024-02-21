# typedfetch

This package was a lambda-lite feature that got moved outside of there to be a standalone package.

Basically it's like if TRPC had a lite version, it's main purpose is to make code suggestions work in your IDE and to catch some critical API errors but that's it.

It's implemented purely in TypeScript and doesn't do any runtime type checks like is done by TRPC. Runtime checks are simply not needed in most of my apps (I perform custom data validations anyway).

If you really need that, you can always ducttape zod no top of your endpoint or use the original thing - TRPC.

import {
  Link,
  redirect,
  useFetcher,
  type ClientActionFunctionArgs,
  type ClientLoaderFunctionArgs,
} from '@remix-run/react'
import { $path } from 'remix-routes'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui'
import { isAuthenticated } from '~/services/auth'
import { authenticate } from '~/services/google-auth'

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  const user = await isAuthenticated(request)
  if (user?.handle) {
    return redirect($path('/:handle', { handle: user.handle }))
  }
  return null
}

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  return await authenticate(request)
}

const SignInForm = () => {
  const fetcher = useFetcher()

  const handleClickSignIn = async () => {
    fetcher.submit(
      {},
      {
        method: 'POST',
        action: $path('/auth/sign_in'),
      },
    )
  }

  return (
    <div className="mx-auto text-center">
      <Button className="rounded-full" onClick={() => handleClickSignIn()}>
        Google アカウントでサインイン
      </Button>
    </div>
  )
}

export const SignInModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="outline">
          はじめる
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Spot Saver</DialogTitle>
          <DialogDescription>
            Spot Saver にサインインしてください。
          </DialogDescription>
        </DialogHeader>

        <SignInForm />
      </DialogContent>
    </Dialog>
  )
}

export default function SignInPage() {
  return (
    <div className="grid h-screen grid-rows-1">
      <Card className="m-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Spot Saver</CardTitle>
          <CardDescription>
            Spot Saver にサインインしてください。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex">
              <SignInForm />
            </div>

            <div className="mx-auto text-center">
              <Button variant="link" asChild>
                <Link to={$path('/')}>トップページに戻る</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

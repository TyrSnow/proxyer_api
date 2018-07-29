import { controller, route } from "../core/injector";
import ProfileService from "../service/profile";
import { ERROR, SUCCESS, TEXT } from "../core/response";
import { auth, USER_AUTH } from "../intercepror/auth";

@controller({
  path: '/profile'
})
class ProfileController {
  constructor(
    private profileService: ProfileService,
  ) {}

  @route('/', 'post')
  @auth(USER_AUTH.USER)
  start(req, res) {
    const { time } = req.query;
    
    this.profileService.profile(time).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/')
  @auth(USER_AUTH.USER)
  get(req, res) {
    const { profile } = req.query;

    this.profileService.get_profile(profile).then(
      TEXT(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default ProfileController;

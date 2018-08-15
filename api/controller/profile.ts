import { controller, route } from "../core";
import ProfileService from "../service/profile";
import { ERROR, SUCCESS, TEXT } from "../helper/response";
import { auth } from "../middleware/auth";
import { USER_AUTH } from "../constants/user";

@controller({
  path: '/profile',
  // use: [auth(USER_AUTH.ADMIN)],
})
class ProfileController {
  constructor(
    private profileService: ProfileService,
  ) {}

  @route('/', 'post')
  start(req, res) {
    const { time } = req.query;
    
    this.profileService.profile(time).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/')
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

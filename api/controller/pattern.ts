import { controller, route } from "../core/injector";
import PatternService from "../service/pattern";
import { USER_AUTH } from "../constants/user";
import { auth } from "../intercepror/auth";
import { SUCCESS, ERROR } from "../core/response";

@controller({
  path: '/patterns',
})
class PatternController {
  constructor(
    private patternService: PatternService,
  ) {}
  
  @route('/:pattern_id', 'put')
  @auth(USER_AUTH.USER)
  update_detail(req, res) {
    const { pattern_id } = req.params;

    this.patternService.update_pattern(pattern_id, req.body).then(
      proxy => proxy.patterns.id(pattern_id),
    ).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:pattern_id', 'get')
  @auth(USER_AUTH.USER)
  get_pattern_detail(req, res) {
    const { pattern_id } = req.params;

    this.patternService.get_detail(pattern_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:pattern_id', 'delete')
  @auth(USER_AUTH.USER)
  delete_pattern(req, res) {
    const { pattern_id } = req.params;

    this.patternService.delete_pattern(pattern_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }
}

export default PatternController;

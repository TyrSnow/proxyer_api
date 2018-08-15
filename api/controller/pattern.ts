import { controller, route } from "../core";
import PatternService from "../service/pattern";
import { USER_AUTH } from "../constants/user";
import { SUCCESS, ERROR } from "../helper/response";
import { auth } from "../middleware/auth";

@controller({
  path: '/patterns',
  use: [auth(USER_AUTH.USER)]
})
class PatternController {
  constructor(
    private patternService: PatternService,
  ) {}
  
  @route('/:pattern_id', 'put')
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
  get_pattern_detail(req, res) {
    const { pattern_id } = req.params;

    this.patternService.get_detail(pattern_id).then(
      SUCCESS(req, res),
    ).catch(
      ERROR(req, res),
    );
  }

  @route('/:pattern_id', 'delete')
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

import Post from '../models/Post.js';
import Challenge from '../models/Challenge.js';

// ============= POSTS =============

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ visibility: 'public' })
      .populate('userId', 'name avatar')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/community/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { content, image, tags, visibility } = req.body;

    const post = await Post.create({
      userId: req.user._id,
      content,
      image,
      tags,
      visibility,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'name avatar');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike a post
// @route   PUT /api/community/posts/:id/like
// @access  Private
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/community/posts/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      userId: req.user._id,
      text,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'name avatar')
      .populate('comments.userId', 'name avatar');

    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/community/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============= CHALLENGES =============

// @desc    Get all challenges
// @route   GET /api/community/challenges
// @access  Private
export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true })
      .populate('createdBy', 'name avatar')
      .populate('participants.userId', 'name avatar')
      .populate('leaderboard.userId', 'name avatar')
      .sort({ startDate: -1 });

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a challenge
// @route   POST /api/community/challenges
// @access  Private
export const createChallenge = async (req, res) => {
  try {
    const { title, description, type, goal, startDate, endDate } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      type,
      goal,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    const populatedChallenge = await Challenge.findById(challenge._id)
      .populate('createdBy', 'name avatar');

    res.status(201).json(populatedChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a challenge
// @route   POST /api/community/challenges/:id/join
// @access  Private
export const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if already joined
    const alreadyJoined = challenge.participants.some(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    challenge.participants.push({
      userId: req.user._id,
      progress: 0,
    });

    await challenge.save();

    const populatedChallenge = await Challenge.findById(challenge._id)
      .populate('createdBy', 'name avatar')
      .populate('participants.userId', 'name avatar');

    res.json(populatedChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update challenge progress
// @route   PUT /api/community/challenges/:id/progress
// @access  Private
export const updateChallengeProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(400).json({ message: 'You have not joined this challenge' });
    }

    participant.progress = progress;

    // Update leaderboard
    const existingLeaderboardEntry = challenge.leaderboard.find(
      l => l.userId.toString() === req.user._id.toString()
    );

    if (existingLeaderboardEntry) {
      existingLeaderboardEntry.score = progress;
    } else {
      challenge.leaderboard.push({
        userId: req.user._id,
        score: progress,
        rank: 0,
      });
    }

    // Sort leaderboard and update ranks
    challenge.leaderboard.sort((a, b) => b.score - a.score);
    challenge.leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    await challenge.save();

    const populatedChallenge = await Challenge.findById(challenge._id)
      .populate('createdBy', 'name avatar')
      .populate('participants.userId', 'name avatar')
      .populate('leaderboard.userId', 'name avatar');

    res.json(populatedChallenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
